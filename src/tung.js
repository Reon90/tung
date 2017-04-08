'use strict';

import Observer  from './observer';
import snabbdom  from 'snabbdom/snabbdom';
import snabbdomH from 'snabbdom/h';
import snabbdomC from 'snabbdom/modules/class';
import snabbdomP from 'snabbdom/modules/props';
import snabbdomS from 'snabbdom/modules/style';
import snabbdomE from './eventlisteners';
import snabbdomA from 'snabbdom/modules/attributes';

class Tung extends Observer {
    constructor(container) {
        super();
        
        if (container && container instanceof window.HTMLElement) {
            this.container = container;
            this.patch = snabbdom.init([snabbdomA, snabbdomC, snabbdomP, snabbdomS, snabbdomE]);
        }

        this.refs = {};
    }

    init() {}

    destroy() {}

    setProps(props) {
        this.props = props;
    }

    setView(tpl, ...components) {
        this.tpl = tpl;
        this.components = components;
    }

    setState(state) {
        Tung.ctx.push(this);
        this.state = state;

        if (!this._inited) {
            this._render(
                this.tpl.call(
                    state,
                    this._process,
                    ...this.tpl.components.map((c) => this.components.find(component => component.id === c || component.name.toLowerCase() === c))
                )
            );
        } else {
            this.fire('changed');
        }
    }

    _render(stateRender) {
        this.stateRender = stateRender;
        
        stateRender.data.hook = { remove: this._remove.bind(this) };
        
        if (this.container) {
            if (this.container.stateRender) {
                this.patch(this.container.stateRender, stateRender);
            } else {
                let div = document.createElement('div');
                this.container.appendChild(div);
                this.patch(div, stateRender);
            }
            this.container.stateRender = stateRender;
            this.els = {};
            this._saveEls(stateRender);
        } else {
            this._inited = true;
        }
    }

    _process(sel, props, child) {
        let ctx = this;
        let block = props.attrs && props.attrs.block;
        let tung = Tung.ctx[Tung.ctx.length-1];
        let isComponent = typeof sel === 'function';
        let childProcessed;
        let childIgnored;

        if (block) {
            ctx = this[block];
            if (Array.isArray(ctx)) {
                child = Tung.processArray(ctx, sel, child);
                childProcessed = true;
            } else if (ctx) {
                if (typeof ctx !== 'object') {
                    ctx = this;
                }
                ctx.inheritedCtx = true;
            } else {
                child = undefined;
                childIgnored = true;
            }
        }

        if (!childIgnored) {
            if (ctx.inheritedCtx) {
                Object.assign(props, Tung.getProps(ctx));
                delete ctx.inheritedCtx;
            }

            if (!childProcessed) {
                child = Tung.processChild.call(tung, sel, child, ctx);
            }

            if (isComponent) {
                if (block) {
                    Tung.executeArray(child, arr => {
                        arr.forEach(child => Object.assign(child.data.attrs, props.attrs))
                    });
                }
            } else {
                child = snabbdomH(sel, props, child);
            }
        }

        return child;
    }

    _saveEls(node) {
        let block = node.data && node.data.attrs && node.data.attrs.block;
        if (block) {
            if (this.els[block]) {
                this.els[block] = Tung.executeArray(this.els[block], arr => {
                    arr.push(node.elm);
                    return arr;
                });
            } else {
                this.els[block] = node.elm;
            }
        }

        if (node.children) {
            node.children.forEach(this._saveEls, this);
        }
    }

    _remove(v, callback) {
        this.fire('removed', this);
        callback();
    }

    _childRemoved() {
        this.setState(this.state);
    }

    _childRemoved(child) {
        child.destroy();
        let ref = this.refs[child.constructor.name];
        if (Array.isArray(ref)) {
            let index = ref.findIndex(ins => ins === child);
            ref.splice(index, 1);
        } else {
            delete this.refs[child.constructor.name];
        }
    }

    static processChild(sel, child, ctx) {
        let isComponent = typeof sel === 'function';
        let isStatefulComponent = sel.name;

        if (isComponent) {
            ctx.inheritedCtx = true;

            if (isStatefulComponent) {
                let initedComponent = this.refs[sel.name];
                if (initedComponent) {
                    Tung.executeArray(initedComponent, arr => {
                        initedComponent = arr.find(c => c.relatedObj === ctx);
                    });
                }

                if (initedComponent) {
                    initedComponent._inited = false;
                    initedComponent.state.inheritedCtx = ctx.inheritedCtx;
                    initedComponent.setState(initedComponent.state);
                    child = initedComponent.stateRender;
                } else {
                    let newComponent = new sel();
                    newComponent.setProps(ctx);
                    newComponent.init();
                    newComponent
                        .on('changed', this._childRemoved, this)
                        .on('removed', this._childRemoved, this);
                    newComponent.relatedObj = ctx;
                    child = newComponent.stateRender;

                    Tung.ctx.pop();
                    if (this.refs[sel.name]) {
                        this.refs[sel.name] = Tung.executeArray(this.refs[sel.name], arr => {
                            arr.push(newComponent);
                            return arr;
                        });
                    } else {
                        this.refs[sel.name] = newComponent;
                    }
                }
            } else {
                child = sel.call(ctx, this._process, ...sel.components.map((c) => this.components.find(component => component.id === c)));
            }
        }
        if (typeof child === 'function') {
            child = child.call(ctx);
            if (Array.isArray(child[0])) {
                child = child[0];
            }
            child = child.filter(node => node !== undefined);
        }
        return child;
    }

    static executeArray(arr, fn) {
        if (Array.isArray(arr)) {
            return fn(arr);
        } else {
            return fn([arr]);
        }
    }

    static processArray(ctx, sel, child) {
        let tung = Tung.ctx[Tung.ctx.length-1];

        return ctx.map((context, index) => {
            if (typeof context !== 'object') {
                context = { item: context };
            }
            context.key = index;
            context.inheritedCtx = true;

            let vnode = Tung.processChild.call(tung, sel, child, context);
            if (Array.isArray(vnode)) {
                if (vnode.length > 1) {
                    console.error('Children have to have parent node in array.');
                }
                vnode = vnode[0];
            }
            return vnode;
        });
    }

    static getProps(ctx) {
        let tung = Tung.ctx[Tung.ctx.length-1];
        let props = {};
        ['class', 'on', 'style', 'props', 'key'].forEach(it => {
            let key = ctx[it];
            if (key !== undefined) {
                if (it === 'on') {
                    for (let event in key) {
                        if (typeof key[event] === 'function') {
                            key[event] = [key[event], tung];
                        }
                    }
                }
                props[it] = key;
            }
        });
        return props;
    }
}

Tung.ctx = [];

export {Tung};
