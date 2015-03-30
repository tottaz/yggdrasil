BANQPAY.example.OverlayManager = new BANQPAY.widget.OverlayManager();
// Data used to built product category submenus
var g_aYProducts = {
       marketplace: [
       { text: "BANQPAY Content Mall", url: "index.php?a=browse_menu" }
],
merchantsolution: [
    { text: "BANQPAY Merchant Solution", url: "index.php?a=merchant_solutions" }
],
merchanttools: [
     { text: "Sell", url: "index.php?a=merchant_sell" },
     { text: "View Links", url: "index.php?a=merchant_add_links" },
     { text: "Create Link", url: "index.php?a=merchant_links" }
],
subscriptions: [
     { text: "View Subscriptions", url: "index.php?a=merchant_view_subcriptions" },
     { text: "Create Subscriptions", url: "index.php?a=merchant_add_subscribe" },
     { text: "View RSS Subscriptions", url: "index.php?a=merchant_view_rss_subcriptions" },
     { text: "Create RSS Subscriptions", url: "index.php?a=merchant_add_rss_subscribe" }
],
virtualterminal: [
     { text: "Advance Mode", url: "index.php?a=advance_mode" },
     { text: "Basic Mode", url: "index.php?a=basic_mode" }
],
merchantaccountinfo: [
     { text: "View All Transactions", url: "index.php?a=view_transactions" },
     { text: "Witdraw Funds", url: "index.php?a=merchant_withdraw" },
     { text: "My Account", url: "index.php?a=edit" },
     { text: "Change Password", url: "index.php?a=change_password" }
],
buyeraccountinfo: [
     { text: "View All Transactions", url: "index.php?a=view_transactions" },
//     { text: "Fund Account", url: "index.php?a=deposit" }
]
};

var g_nTimeoutId;
// "mouseover" event handler for the root menu
function onMenuBarMouseOver(p_sType, p_aArguments, p_oMenu) {
    if(g_nTimeoutId) {
       window.clearTimeout(g_nTimeoutId);
    }
}

// "mouseover" event handler for each submenu
function onSubmenuMouseOver(p_sType, p_aArguments, p_oMenu) {
if(g_nTimeoutId) {
        window.clearTimeout(g_nTimeoutId);
 }
}

// "mouseout" event handler for each submenu
function onSubmenuMouseOut(p_sType, p_aArguments, p_oMenu) {
  function hideMenu() {
                    p_oMenu.hide();
                }
                if(g_nTimeoutId) {
                    window.clearTimeout(g_nTimeoutId);
                }
                g_nTimeoutId = window.setTimeout(hideMenu, 750);
            }

            // "mousedown" handler for the document
            function onDocumentMouseDown(p_oEvent) {
                BANQPAY.example.OverlayManager.hideAll();
            }

            // "mouseover" handler for each item in the menu bar
            function onMenuBarItemMouseOver(p_sType, p_aArguments, p_oMenuItem) {
                var oActiveItem = this.parent.activeItem;

                // Hide any other submenus that might be visible
                if(oActiveItem && oActiveItem != this) {
                    this.parent.clearActiveItem();
                }
            
                // Select and focus the current MenuItem instance
                this.cfg.setProperty("selected", true);
                this.focus();
            
                // Show the submenu for this instance
                var oSubmenu = this.cfg.getProperty("submenu");
                if(oSubmenu) {
                    oSubmenu.show();
                }
            };
        
            // "mouseout" handler for each item in the menu bar
            function onMenuBarItemMouseOut(p_sType, p_aArguments, p_oMenuItem) {
                this.cfg.setProperty("selected", false);
                var oSubmenu = this.cfg.getProperty("submenu");
                if(oSubmenu) {
                    var oEvent = p_aArguments[0],
                        oRelatedTarget = BANQPAY.util.Event.getRelatedTarget(oEvent);
                    if(
                        !(
                            oRelatedTarget == oSubmenu.element || 
                            this._oDom.isAncestor(oSubmenu.element, oRelatedTarget)
                        )
                    ) {
                        oSubmenu.hide();
                    }
                }
            };

            // "load" handler for the window
            function onWindowLoad() {
                var oMenuBar = new BANQPAY.widget.MenuBar("yproducts");
                var i = oMenuBar.getItemGroups()[0].length - 1,
                    oMenuItem,
                    oSubmenu,               
                    aSubmenuItems,
                    nSubmenuItems;
                do {
                    oMenuItem = oMenuBar.getItem(i);
                    aSubmenuItems = g_aYProducts[oMenuItem.element.id];
                    if(aSubmenuItems) {
                        // Create a submenu
                        oSubmenu = new BANQPAY.widget.Menu(
                                        (oMenuItem.element.id + "menu")
                                    );
                        // Add a "mouseover" event handler to the submenu
                        oSubmenu.mouseOverEvent.subscribe(
                                onSubmenuMouseOver, 
                                oSubmenu, 
                                true
                            );

                        // Add a "mouseout" event handler to the submenu
                        oSubmenu.mouseOutEvent.subscribe(
                                onSubmenuMouseOut,
                                oSubmenu, 
                                true
                            );

                        // Add items to the submenu
                        nSubmenuItems = aSubmenuItems.length;
                        for(var n=0; n<nSubmenuItems; n++) {
                            oSubmenu.addItem(
                                new BANQPAY.widget.MenuItem(
                                    aSubmenuItems[n].text, 
                                    { url: aSubmenuItems[n].url}
                                    )
                                );
                        }

                        // Add the submenu to its parent item in the main menu
                        oMenuItem.cfg.setProperty("submenu", oSubmenu);
                        BANQPAY.example.OverlayManager.register(oSubmenu);
                    }
                }
                while(i--);

                // Render the menubar and corresponding submenus
                oMenuBar.render();
                /*
                    Add a "mouseover" and "mouseout" event handler each item 
                    in the menu bar 
                */               
                var aMenuBarItems = oMenuBar.getItemGroups()[0],
                    i = aMenuBarItems.length - 1;
                do {
                    aMenuBarItems[i].mouseOverEvent.subscribe(
                        onMenuBarItemMouseOver, 
                        this
                    );
                    aMenuBarItems[i].mouseOutEvent.subscribe(
                        onMenuBarItemMouseOut, 
                        this
                    );
                }
                while(i--);

                // Add a "mouseover" handler to the menubar
                oMenuBar.mouseOverEvent.subscribe(
                        onMenuBarMouseOver, 
                        oMenuBar, 
                        true
                    );

                // Add a "mousedown" handler to the document
                BANQPAY.util.Event.addListener(
                        document, 
                        "mousedown", 
                        onDocumentMouseDown
                    );
            }

            // Add a "load" handler for the window
            BANQPAY.util.Event.addListener(window, "load", onWindowLoad);