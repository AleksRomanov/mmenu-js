import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import configs from './_configs';
Mmenu.configs.fixedElements = configs;
Mmenu.configs.classNames.fixedElements = {
    fixed: 'Fixed',
    sticky: 'Sticky'
};
export default function () {
    if (!this.opts.offCanvas) {
        return;
    }
    var configs = this.conf.fixedElements;
    var _fixd, _stck, fixed, stick, wrppr;
    this.bind('setPage:after', (page) => {
        //	Fixed elements
        _fixd = this.conf.classNames.fixedElements.fixed;
        wrppr = Mmenu.DOM.find(document, configs.fixed.insertSelector)[0];
        fixed = Mmenu.DOM.find(page, '.' + _fixd);
        fixed.forEach((fxd) => {
            Mmenu.refactorClass(fxd, _fixd, 'mm-slideout');
            wrppr[configs.fixed.insertMethod](fxd);
        });
        //	Sticky elements
        _stck = this.conf.classNames.fixedElements.sticky;
        Mmenu.DOM.find(page, '.' + _stck)
            .forEach((stick) => {
            Mmenu.refactorClass(stick, _stck, 'mm-sticky');
        });
        stick = Mmenu.DOM.find(page, '.mm-sticky');
    });
    this.bind('open:start', () => {
        if (stick.length) {
            if (window.getComputedStyle(document.documentElement).overflow == 'hidden') {
                let scrollTop = (document.documentElement.scrollTop || document.body.scrollTop) + configs.sticky.offset;
                stick.forEach((element) => {
                    element.style.top = (parseInt(window.getComputedStyle(element).top, 10) + scrollTop) + 'px';
                });
            }
        }
    });
    this.bind('close:finish', () => {
        stick.forEach((element) => {
            element.style.top = '';
        });
    });
}
;
