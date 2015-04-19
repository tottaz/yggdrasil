$.noty.themes.made = {
    name    : 'made',
    helpers : {},
    modal   : {
        css: {
            position       : 'fixed',
            width          : '100%',
            height         : '100%',
            backgroundColor: '#000',
            zIndex         : 10000,
            opacity        : 0.6,
            display        : 'none',
            left           : 0,
            top            : 0
        }
    },
    style   : function() {

        this.$bar.css({
            overflow    : 'hidden',
            margin      : 0,
            borderRadius: '0',
            width:'100%'
        });

        this.$message.css({
            fontSize  : '14px',
            lineHeight: '16px',
            textAlign : 'center',
            padding   : '10px',
            width     : 'auto',
            position  : 'relative'
        });

        this.$closeButton.css({
            position  : 'absolute',
            top       : 4, right: 4,
            width     : 10, height: 10,
            display   : 'none',
            cursor    : 'pointer'
        });

        this.$buttons.css({
            padding        : 5,
            textAlign      : 'right'
        });

        this.$buttons.find('button').css({
            marginLeft: 5
        });

        this.$buttons.find('button:first').css({
            marginLeft: 0
        });

        this.$bar.on({
            mouseenter: function() {
                $(this).find('.noty_close').stop().fadeTo('normal', 1);
            },
            mouseleave: function() {
                $(this).find('.noty_close').stop().fadeTo('normal', 0);
            }
        });

        switch(this.options.layout.name) {
            case 'top':
                break;
            case 'topCenter':
            
            case 'center':
            case 'bottomCenter':
            case 'inline':
                this.$message.css({fontSize: '13px', textAlign: 'center'});
                break;
            case 'topLeft':
            case 'topRight':
                this.$bar.css({
                    border: 'none'
                });
            case 'bottomLeft':
            case 'bottomRight':
            case 'centerLeft':
            case 'centerRight':
                this.$bar.css({
                    border   : '1px solid #eee'
                });
                this.$message.css({fontSize: '13px', textAlign: 'left'});
                break;
            case 'bottom':
                this.$bar.css({
                    borderTop   : '2px solid #eee',
                    borderLeft  : '2px solid #eee',
                    borderRight : '2px solid #eee',
                    borderBottom: '2px solid #eee'
                });
                break;
            default:
                break;
        }

        switch(this.options.type) {
            case 'alert':
            case 'notification':
                this.$bar.css({backgroundColor: '' ,border:'none', color: ''});
                break;
            case 'warning':
                this.$bar.css({backgroundColor: '', borderColor: '',border:'none', color: ''});
                this.$buttons.css({borderTop: ''});
                this.$message.css({padding: 0});
                break;
            case 'error':
                this.$bar.css({backgroundColor: '', borderColor: '',border:'none', color: ''});
                this.$buttons.css({borderTop: ''});
                this.$message.css({padding: 0});
                break;
            case 'information':
                this.$bar.css({backgroundColor: '', borderColor: '',border:'none', color: ''});
                this.$buttons.css({borderTop: ''});
                this.$message.css({padding: 0});
                break;
            case 'success':
                this.$bar.css({backgroundColor: '', borderColor: '',border:'none', color: ''});
                this.$buttons.css({borderTop: ''});
                this.$message.css({padding: 0});
                break;
            default:
                this.$bar.css({backgroundColor: '', borderColor: '',border:'none', color: '#444'});
                break;
        }
    },
    callback: {
        onShow : function() {

        },
        onClose: function() {

        }
    }
};
