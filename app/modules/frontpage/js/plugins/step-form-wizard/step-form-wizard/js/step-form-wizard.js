(function($) {

    var defaults = {
        duration: 500,
        timingFunction: 'swing',
        linkNav: true,
        showNav: true, // true = top, false , right, bottom, left
        showNavNumbers: true,
        showButtons: true,
        showLegend: true,
        nextBtn: $('<a class="next-btn sf-right sf-btn" href="#">NEXT</a>'),
        prevBtn: $('<a class="prev-btn sf-left sf-btn" href="#">PREV</a>'),
        finishBtn: $('<input class="finish-btn sf-right sf-btn" type="submit" value="FINISH"/>'),
        onNext: function(i, wizard) {},
        onPrev: function(i, wizard) {},
        onFinish: function(i, wizard) {},
        onSlideChanged: function(from, to, wizard) {},
        startStep: 0,
        stepOffset: 10,
        height: 'first', // auto, tallest, first, 200px
        theme: 'sea', // sea, sky, simple, circle
        markPrevSteps: false
    }

    function stepFormWizard(element, options) {
        var widget = this;
        widget.config = $.extend({}, defaults, options);
        widget.element = element;
        widget.steps = element.find("fieldset");
        if(!widget.config.showLegend) {
            widget.element.addClass('sf-hide-legend')
        }

        widget.btnFinishTmp = widget.config.finishBtn;
        widget.btnPrevTmp = widget.config.prevBtn;
        widget.btnNextTmp = widget.config.nextBtn;

        widget.viewPort;
        widget.navWrap;
        widget.stepOffset = widget.config.stepOffset;
        if(widget.config.startStep >= widget.steps.length) {
            widget.config.startStep = widget.steps.length - 1;
        }
        widget.stepActive = widget.config.startStep;

        widget.init();
        element.trigger('sf-loaded');

        return widget;
    }

    stepFormWizard.prototype.init = function() {
        this.element.append($("<div>").addClass('sf-viewport'));
        this.viewPort = $('.sf-viewport', this.element);

        this.element.wrap($('<div>').addClass('sf-wizard').attr('id', this.element.attr('id') + '-box'));
        this.wizard = this.element.parent();
        this.wizard.parent().addClass('sf-' + this.config.theme);
        if(!this.config.showNavNumbers) {
            this.wizard.addClass('sf-nonumbers')
        }

        $(this.viewPort).append($("<div>").addClass('sf-fieldwrap clearfix'));
        this.fieldWrap = $('.sf-fieldwrap', this.element);

        this.element.append($("<div>").addClass('sf-controls clearfix'));
        this.controls = $('.sf-controls', this.element);

        if(!this.config.showButtons) {
            this.controls.addClass('sf-hide-buttons');
        }

        var widget = this;

        if(this.config.showNav !== false) {
            this.initNav();
        }

        this.steps.each(function(index) {

            var wrap_div = $('<div>').addClass('sf-step sf-step-' + index);
            if(index == widget.config.startStep) {
                wrap_div.addClass('sf-step-active');
            } else {
                wrap_div.addClass('sf-step-no-active');
            }
            $(this).wrap(wrap_div)
                .parent()
                .appendTo(widget.fieldWrap);
            $(this).append($('<div>').addClass('sf-' + index));


            if(index == widget.config.startStep) {

                widget.initBtnFinish(widget.config.startStep);
                widget.initBtnNext(widget.config.startStep);
                widget.initBtnPrev(widget.config.startStep);
                if(widget.config.startStep == 0) {
                    widget.element.find('.sf-btn-prev').hide();
                }
                if(widget.config.startStep != widget.steps.length - 1) {
                    widget.element.find('.sf-btn-finish').hide();
                } else {
                    widget.element.find('.sf-btn-next').hide();
                }
            }
        });

        this.setProportion();

        $(window).resize(function() {
            //widget.setProportion();
            widget.careNav(widget.stepActive, widget.stepActive);
            widget.setProportion();
        })


        widget.element.on('click', '.next-btn', function(e, data) {
            var ret = false;
            if(widget.config.onNext(widget.stepActive, widget.wizard) !== false) {
                ret = widget.goTo($('.sf-controls .next-btn', widget.element).data('step'));
            }
            if(data !== undefined) {
                data.ret = ret;
            }
            e.preventDefault();
        })

        widget.element.on('click', '.prev-btn', function(e, data) {
            var ret = false;
            if(widget.config.onPrev(widget.stepActive, widget.wizard) !== false) {
                ret = widget.goTo($('.sf-controls .prev-btn', widget.element).data('step'));
            }
            if(data !== undefined) {
                data.ret = ret;
            }
            e.preventDefault();
        })

        widget.element.on('click', '.finish-btn', function(e, data) {
            var ret = false;
            var event = jQuery.Event( 'sf-finish' );
            widget.element.trigger(event, [widget.stepActive, widget.stepActive, widget.wizard]);
            if(widget.config.onFinish(widget.stepActive, widget.wizard) === false || event.isDefaultPrevented()) {
                e.preventDefault();
            } else {
                ret = true;
            }
            if(data !== undefined) {
                data.ret = ret;
            }
        })

        widget.element.on('keydown', ':input', function(e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 13) {
                widget.next();
                e.preventDefault();
            }
        });
    }

    stepFormWizard.prototype.initNav = function() {
        var widget = this;
        var sf_nav_wrap = $('<div>').addClass('sf-nav-wrap clearfix');
        var sf_nav = $('<ul>').addClass('sf-nav clearfix');
        sf_nav_wrap.append(sf_nav);
        if(widget.config.showNav == 'bottom') {
            this.element.after(sf_nav_wrap);
        } else {
            this.element.before(sf_nav_wrap);
        }
        this.navWrap = $('.sf-nav-wrap', widget.wizard);

        this.steps.each(function(index) {
            var nav_li = $('<li>').addClass('sf-nav-step sf-nav-step-' + index).data('step', index);
            if(widget.config.markPrevSteps && index < widget.config.startStep ) {
                nav_li.addClass('sf-nav-prev-step');
            }
            if(widget.config.showNavNumbers) {
                nav_li.addClass('sf-li-number');
            } else {
                nav_li.addClass('sf-li-nonumber');
            }
            $('<span>')
                .addClass('sf-nav-subtext')
                .html(
                    $(this)
                        .find("legend")
                        .first()
                        .html()
                )
                .appendTo(nav_li);


            var nav_num = $('<div>')
                .addClass('sf-nav-number')
                .appendTo(nav_li);

            $('<span>')
                .addClass('sf-nav-number-inner')
                .html(index + 1)
                .appendTo(nav_num);

            nav_num = $('<div>').appendTo(nav_li);


            if(index == widget.config.startStep) {
                nav_li.addClass('sf-active');
            }
            if(widget.config.linkNav == true) {
                nav_li.addClass('sf-nav-link');
            }
            if(widget.config.showNav == 'left') {
                $(".sf-nav-wrap", widget.wizard).addClass('sf-nav-left');
                widget.element.addClass('sf-nav-on-left');
            }
            if(widget.config.showNav == 'right') {
                $(".sf-nav-wrap", widget.wizard).addClass('sf-nav-right');
                widget.element.addClass('sf-nav-on-right');
            }
            if(widget.config.showNav == 'top' || widget.config.showNav === true) {
                $(".sf-nav-wrap", widget.wizard).addClass('sf-nav-top');
                widget.element.addClass('sf-nav-on-top');
            }
            if(widget.config.showNav == 'bottom') {
                $(".sf-nav-wrap", widget.wizard).addClass('sf-nav-bottom');
                widget.element.addClass('sf-nav-on-bottom');
            }
            widget.wizard.find(".sf-nav").append(nav_li);
        });

        $('.sf-nav-step.sf-nav-link', widget.wizard).on('click', function(e) {
            var this_step = $(this).data('step');
            var step_count = widget.stepActive - this_step;
            var can_go = widget.stepActive;
            if(step_count < 0) {
                for(var i = widget.stepActive; i < this_step; i++) {
                    if(widget.config.onNext(i) !== false) {
                        can_go = i + 1;
                    } else {
                        break;
                    }
                }
            } else {
                for(var i = widget.stepActive; i > this_step; i--) {
                    if(widget.config.onPrev(i) !== false) {
                        can_go = i - 1;
                    } else {
                        break;
                    }
                }
            }
            widget.goTo(can_go);
            e.preventDefault();
        })

        this.careNav(this.stepActive, this.stepActive);
    }

    stepFormWizard.prototype.setProportion = function() {
        this.stepWidth = this.viewPort.width();

        var viewPortWidth = this.stepWidth * this.steps.length;

        var height = 0;
        if(this.config.height == 'auto' && this.steps.length) {
            //$(this.steps[this.stepActive]).height('auto');
            this.viewPort.height('auto');
            var heightView = $(this.steps[this.stepActive]).outerHeight(true);
            this.viewPort.height(heightView);
        }
        if(this.config.height == 'first' && this.steps.length) {
            $(this.steps[0]).height('auto');
            height = $(this.steps[0]).height();
        }
        if(!isNaN(parseInt(this.config.height)) && this.steps.length) {
            height = this.config.height;
        }
        if(this.config.height == 'tallest' && this.steps.length) {
            this.steps.each(function(index) {
                $(this).height('auto');
                if($(this).height() > height) {
                    height = $(this).height();
                }
            });
        }

        var widget = this;

        this.steps.each(function(index) {
            var fieldset = $(this).parent()
            fieldset.css({
                width: widget.stepWidth + 'px',
                'float': 'left',
                'margin-right': widget.stepOffset + 'px'
            });
            if(height) {
                $(this).height(height);
            }
        });

        this.fieldWrap.width(viewPortWidth + this.stepOffset * this.steps.length + 'px');
        this.fieldWrap.css({'margin-left': "-" + (this.stepActive * this.stepWidth + this.stepOffset * this.stepActive) + 'px'})

    }

    stepFormWizard.prototype.goTo = function(index) {
        var widget = this;
        var step_active = this.stepActive;
        var step_count = step_active - index;

        var event = jQuery.Event( 'sf-step-before' );
        widget.element.trigger(event, [step_active, index, widget.wizard]);
        if(event.isDefaultPrevented()) {
            return false;
        }

        if(widget.config.markPrevSteps) {
            $('.sf-nav-step', widget.navWrap).each(function(i) {
                $(this).removeClass('sf-nav-prev-step');
                if(i < index) {
                    $(this).addClass('sf-nav-prev-step');
                }
            })
        }

        /* nav animate*/
        this.careNav(index, step_active);

        widget.element.find('.sf-step').removeClass('sf-step-no-active').addClass('sf-step-active');

        var stepShift = "+=";
        if(step_count < 0) {
            stepShift = "-=";
        }
        step_count = Math.abs(step_count);
        var step_width = (step_count * this.stepWidth + this.stepOffset * step_count);
        this.fieldWrap.animate({
            'margin-left': stepShift + step_width
        }, this.config.duration * step_count, this.config.timingFunction, function() {
            widget.element.find('.sf-step').removeClass('sf-step-active').addClass('sf-step-no-active');
            widget.element.find('.sf-step-' + index).removeClass('sf-step-no-active').addClass('sf-step-active');
            widget.element.trigger('sf-step-after', [step_active, index, widget.wizard]);
            widget.config.onSlideChanged(step_active, index, this.wizard)
        })
        this.stepActive = index;
        $('.sf-nav-step', this.wizard).removeClass('sf-active');
        $('.sf-nav-step-' + index, this.wizard).addClass('sf-active');

        if(this.config.height == 'auto' && this.steps.length) {
            var height = $(this.steps[this.stepActive]).outerHeight(true);
            this.viewPort.animate({
                'height': height + 'px'
            }, this.config.duration, this.config.timingFunction)
        }

        if(index + 1 < this.steps.length) {
            this.btnNext.data('step', index + 1).fadeIn(100);
        } else {
            this.btnNext.fadeOut(0);
        }
        if(index + 1 >= this.steps.length) {
            this.btnFinish.data('step', index - 1).fadeIn(100);
        } else {
            this.btnFinish.fadeOut(0);
        }
        if(index == 0) {
            this.btnPrev.fadeOut(100);
        } else {
            this.btnPrev.data('step', index - 1).fadeIn(100);
        }
        return true;
    }

    stepFormWizard.prototype.careNav = function(index, step_active) {
        var widget = this;

        if(widget.config.showNav !== false) {
            var navWidth = widget.navWrap.width();
            var navStepWidth = new Array();
            if(widget.navWrap.hasClass('sf-nav-top') || widget.navWrap.hasClass('sf-nav-bottom')) {
                var actStepLeft = 0;
                var navStepsWidth = 0;
                $('.sf-nav-step', widget.navWrap).each(function(i) {
                    navStepWidth[i] = $(this).outerWidth(true);
                    navStepsWidth += navStepWidth[i];
                    if(i < index) {
                        actStepLeft += navStepWidth[i];
                    }
                })
                if(step_active - index >= 0) { // backward step
                    actStepLeft = actStepLeft - navStepWidth[index - 1]
                }
                if(navStepsWidth > navWidth) { // nav must be more width than page
                    var navDiffWidth = navStepsWidth - navWidth;
                    var navNextIndex = index - 1;
                    var navOffset = 0;
                    if(step_active - index < 0) { // forward step
                        navNextIndex =  index + 1;
                        navOffset = -50;
                    }
                    if(actStepLeft > navDiffWidth) { // max left offset
                        actStepLeft = navDiffWidth;
                        navOffset = 0;
                    }
                    var next_step = $('.sf-nav-step-' + navNextIndex, this.wizard);
                    if(next_step.length) {
                        $('.sf-nav', widget.navWrap).animate({
                            left: '-' + (actStepLeft + navOffset) + 'px'
                        }, this.config.duration);

                    } else {
                        if(navNextIndex < 0) { // first step
                            $('.sf-nav', widget.navWrap).animate({
                                left: 0 + 'px'
                            }, this.config.duration);
                        } else { // last step
                            $('.sf-nav', widget.navWrap).animate({
                                left: '-' + (actStepLeft ) + 'px'
                            }, this.config.duration);
                        }
                    }
                }
            } else {
                var maxStepWidth = 0;
                $('.sf-nav-step', widget.navWrap).each(function(i) {
                    widget.navWrap.css('width', '9999px')
                    var stepWidth = $(this).css('float', 'left').outerWidth(true);
                    widget.navWrap.css('width', '')
                    $(this).css('float', '');

                    if(maxStepWidth < stepWidth) {
                        maxStepWidth = stepWidth;
                    }
                })
                maxStepWidth += 2;
                var contentWidth = widget.element.closest('.sf-wizard').width() - maxStepWidth;
                widget.element.css({
                    width: contentWidth + 'px',
                    'float': ''
                });
                if(widget.navWrap.hasClass('sf-nav-left')) {
                    widget.element.css({
                        'margin-left': maxStepWidth + 'px'
                    });
                }
                widget.navWrap.css('width', maxStepWidth + 'px');
            }
        }
    }

    stepFormWizard.prototype.refresh = function() {
        this.careNav(this.stepActive, this.stepActive);
        this.setProportion();
    }

    stepFormWizard.prototype.initBtnNext = function(index) {

        this.btnNext = this.btnNextTmp
            .clone(true)
            .addClass('sf-btn-next')
            .data('step', index + 1);
        this.btnNext.appendTo($(this.controls));

    }

    stepFormWizard.prototype.initBtnPrev = function(index) {

        this.btnPrev = this.btnPrevTmp
            .clone(true)
            .addClass('sf-btn-prev')
            .data('step', index - 1);
        this.btnPrev.appendTo($(this.controls));

    }

    stepFormWizard.prototype.initBtnFinish = function(index) {

        $('.sf-step-' + index).append(" ");
        this.btnFinish = this.btnFinishTmp
            .clone(true)
            .addClass('sf-btn-finish')
            .data('step', index - 1);
        this.btnFinish.appendTo($(this.controls));

    }

    stepFormWizard.prototype.next = function() {
        var data = {ret: false};
        if(this.stepActive < this.steps.length - 1) {
            $('.sf-controls .next-btn', this.element).trigger('click', [data]);
        } else {
            $('.sf-controls .finish-btn', this.element).trigger('click', [data]);
        }
        return data.ret;
    }

    stepFormWizard.prototype.prev = function() {
        var data = {ret: false};
        $('.sf-controls .prev-btn', this.element).trigger('click', [data]);
        return data.ret;
    }

    stepFormWizard.prototype.finish = function() {
        var data = {ret: false};
        $('.sf-controls .finish-btn', this.element).trigger('click', [data]);
        return data.ret;
    }

    $.fn.stepFormWizard = function(options) {
        var sfw = new stepFormWizard(this.first(), options);
        return sfw;
    };
})(jQuery);