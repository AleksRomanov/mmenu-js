import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';
Mmenu.options.iconPanels = options;
export default function () {
    var options = this.opts.iconPanels;
    var keepFirst = false;
    //	Extend shorthand options
    if (typeof options == 'boolean') {
        options = {
            add: options
        };
    }
    if (typeof options == 'number' ||
        typeof options == 'string') {
        options = {
            add: true,
            visible: options
        };
    }
    if (typeof options != 'object') {
        options = {};
    }
    if (options.visible == 'first') {
        keepFirst = true;
        options.visible = 1;
    }
    //	/Extend shorthand options
    this.opts.iconPanels = Mmenu.extend(options, Mmenu.options.iconPanels);
    options.visible = Math.min(3, Math.max(1, options.visible));
    options.visible++;
    //	Add the iconpanels
    if (options.add) {
        this.bind('initMenu:after', () => {
            var classnames = ['mm-menu_iconpanel'];
            if (options.hideNavbar) {
                classnames.push('mm-menu_hidenavbar');
            }
            if (options.hideDivider) {
                classnames.push('mm-menu_hidedivider');
            }
            this.node.menu.classList.add(...classnames);
        });
        var classnames = [];
        if (!keepFirst) {
            for (var i = 0; i <= options.visible; i++) {
                classnames.push('mm-panel_iconpanel-' + i);
            }
        }
        this.bind('openPanel:start', (panel) => {
            var panels = Mmenu.DOM.children(this.node.pnls, '.mm-panel');
            panel = panel || panels[0];
            if (panel.parentElement.matches('.mm-listitem_vertical')) {
                return;
            }
            if (keepFirst) {
                panels.forEach((panel, p) => {
                    panel.classList[p == 0 ? 'add' : 'remove']('mm-panel_iconpanel-first');
                });
            }
            else {
                //	Remove the "iconpanel" classnames from all panels.
                panels.forEach((panel) => {
                    panel.classList.remove(...classnames);
                });
                //	Filter out panels that are not opened.
                panels = panels.filter(panel => panel.matches('.mm-panel_opened-parent'));
                //	Add the current panel to the list.
                let panelAdded = false;
                panels.forEach((elem) => {
                    if (panel === elem) {
                        panelAdded = true;
                    }
                });
                if (!panelAdded) {
                    panels.push(panel);
                }
                //	Remove the "hidden" classname from all opened panels.
                panels.forEach((panel) => {
                    panel.classList.remove('mm-hidden');
                });
                //	Slice the opened panels to the max visible amount.
                panels = panels.slice(-options.visible);
                //	Add the "iconpanel" classnames.
                panels.forEach((panel, p) => {
                    panel.classList.add('mm-panel_iconpanel-' + p);
                });
            }
        });
        this.bind('initListview:after', (panel) => {
            if (options.blockPanel &&
                !panel.parentElement.matches('.mm-listitem_vertical') &&
                !Mmenu.DOM.children(panel, '.mm-panel__blocker')[0]) {
                let blocker = Mmenu.DOM.create('a.mm-panel__blocker');
                blocker.setAttribute('href', '#' + panel.closest('.mm-panel').id);
                panel.prepend(blocker);
            }
        });
    }
}
;
