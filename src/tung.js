'use strict';

import Observer from './observer';
import snabbdom from 'snabbdom/snabbdom';
import snabbdomH from 'snabbdom/h';
import snabbdomC from 'snabbdom/modules/class';
import snabbdomP from 'snabbdom/modules/props';
import snabbdomS from 'snabbdom/modules/style';
import snabbdomE from 'snabbdom/modules/eventlisteners';
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
    
    destroy(v, c) {
        debugger
        this.fire('removed', this);
        c();
    }

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

        if (!this.inited) {
            this.render(
                this.tpl.call(
                    state,
                    this.process,
                    ...this.tpl.components.map((c) => this.components.find(component => component.id === c || component.name.toLowerCase() === c))
                )
            );
        } else {
            this.fire('changed');
        }
    }
    
    render(stateRender) {
        this.stateRender = stateRender;
        
        stateRender.data.hook = { remove: this.destroy.bind(this) };
        
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
            this.saveEls(stateRender);
        } else {
            this.inited = true;
        }
    }

    process(sel, props, child) {
        let ctx = this;
        let block = props.attrs && props.attrs.block;
        let instance = Tung.ctx[Tung.ctx.length-1];
        if (block) {
            ctx = this[block];
            if (Array.isArray(ctx)) {
                child = ctx.map((context, index) => {
                    if (typeof context !== 'object') {
                        context = { item: context };
                    }
                    context.key = index;
                    context.inheritedCtx = true;

                    let vnode = Tung.proccessChild.call(instance, sel, child, context);
                    if (Array.isArray(vnode)) {
                        if (vnode.length > 1) {
                            console.error('Children have to have parent node in array.');
                        }
                        vnode = vnode[0];
                    }
                    return vnode;
                });
            } else if (ctx) {
                if (typeof ctx !== 'object') {
                    ctx = this;
                }
                Object.assign(props, Tung.getProps(ctx));
                child = Tung.proccessChild.call(instance, sel, child, ctx);
            } else {
                return;
            }
        } else {
            if (ctx.inheritedCtx) {
                Object.assign(props, Tung.getProps(ctx));
                delete ctx.inheritedCtx;
            }
            child = Tung.proccessChild.call(instance, sel, child, this);
        }
        
        if (typeof sel === 'function') {
            if (props.attrs && props.attrs.block) {
                if (Array.isArray(child)) {
                    child.forEach(c => Object.assign(c.data.attrs, props.attrs));
                } else {
                    Object.assign(child.data.attrs, props.attrs);
                }
            }
            return child;
        }

        return snabbdomH(sel, props, child);
    }
    
    static proccessChild(sel, child, ctx) {
        if (typeof sel === 'function') {
            ctx.inheritedCtx = true;
            if (sel.name) {
                let existentComponent = this.refs[sel.name];
                if (existentComponent) {
                    if (Array.isArray(existentComponent)) {
                        existentComponent = existentComponent.find(c => c.relatedObj === ctx);
                    } else {
                        existentComponent = existentComponent.relatedObj === ctx ? existentComponent : null;
                    }
                }
                if (existentComponent) {
                    existentComponent.inited = false;
                    Object.assign(existentComponent.state, ctx);
                    existentComponent.setState(existentComponent.state);
                    child = existentComponent.stateRender;
                } else {
                    let newComponent = new sel();
                    newComponent.setProps(ctx);
                    newComponent.init();
                    newComponent.on('changed', this.childChanged, this)
                        .on('removed', this.childRemoved, this);
                    newComponent.relatedObj = ctx;
                    child = newComponent.stateRender;
                    Tung.ctx.pop();
                    if (this.refs[sel.name]) {
                        if (Array.isArray(this.refs[sel.name])) {
                            this.refs[sel.name].push(newComponent);
                        } else {
                            this.refs[sel.name] = [this.refs[sel.name], newComponent];
                        }
                    } else {
                        this.refs[sel.name] = newComponent;
                    }
                }
            } else {
                child = sel.call(ctx, this.process, ...sel.components.map((c) => this.components.find(component => component.id === c)));
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
    
    static getProps(ctx) {
        let props = {};
        ['class', 'on', 'style', 'props', 'key'].forEach(it => {
            if (ctx[it] !== undefined) {
                props[it] = ctx[it];
            }
        });
        return props;
    }
    
    saveEls(node) {
        let block = node.data && node.data.attrs && node.data.attrs.block;
        if (block) {
            if (this.els[block]) {
                if (Array.isArray(this.els[block])) {
                    this.els[block].push(node.elm);
                } else {
                    this.els[block] = [this.els[block], node.elm];
                }
            } else {
                this.els[block] = node.elm;
            }
        }

        if (node.children) {
            node.children.forEach(this.saveEls, this);
        }
    }

    childChanged() {
        this.setState(this.state);
    }

    childRemoved(child) {
        let ref = this.refs[child.constructor.name];
        if (Array.isArray(ref)) {
            let index = ref.findIndex(ins => ins === child);
            ref.splice(index, 1);
        } else {
            delete this.refs[child.constructor.name];
        }
    }
}

Tung.ctx = [];

export {Tung};
