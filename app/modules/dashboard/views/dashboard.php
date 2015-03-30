<div id="body" class="unselectable">
	<div id="content" style="visibility: hidden">
		<div id="metro-sections-container" class="metro">
			<div class="metro-sections" data-bind="foreach: sections">
				<div class="metro-section" data-bind="sortable: { data: tiles }">
					<div data-bind="attr: { id: uniqueId, 'class': tileClasses }">
						<a class="metro-tile-link"> <!-- ko if: tileImage -->
						<div class="tile-image">
							<img data-bind="attr: { src: tileImage }" src="app/modules/dashboard/img/desktop.png" />
						</div> <!-- /ko --> <!-- ko if: iconSrc --> <!-- ko if: slides().length == 0 -->
						<div data-bind="attr: { 'class': iconClasses }">
							<img data-bind="attr: { src: iconSrc }" src="app/modules/dashboard/img/desktop.png" />
						</div> <!-- /ko --> <!-- /ko -->
						<div data-bind="foreach: slides">
							<div class="tile-content-main">
								<div data-bind="html: $data"></div>
							</div>
						</div> <!-- ko if: label --> <span class="tile-label" data-bind="html: label">Label</span> <!-- /ko --> <!-- ko if: counter --> <span class="tile-counter" data-bind="html: counter">10</span> <!-- /ko --> <!-- ko if: subContent -->
						<div data-bind="attr: { 'class': subContentClasses }, html: subContent">
							subContent
						</div> <!-- /ko --> </a>
					</div>

				</div>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
	// Bootstrap initialization
	$(document).ready(function() {
		$('.dropdown-toggle').dropdown();
	}); 
</script>

<script type="text/javascript">
	window.currentUser = new User({
		firstName : "None",
		lastName : "Anonymous",
		photo : "app/modules/dashboard/img/userno-frame.png",
		isAnonymous : true
	}); 
</script>

<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript" src="app/modules/dashboard/js/CombinedDashboard.js"></script>

<script type="text/javascript">
	window.profileData = null;

	$(document).ready(function() {

	}); 
</script>