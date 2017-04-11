const chai = require('chai');
const assert = chai.assert;
const jsdom = require('mocha-jsdom');

const page = require('./tpl/page');
const simple = require('./tpl/simple');
const btn = require('./tpl/components/btn');
const card = require('./tpl/components/card');
const Tung = require('dist/tung').Tung;

function walk(node) {
    if (this[node.sel]) {
        this[node.sel] = this[node.sel] + 1;
    } else {
        this[node.sel] = 1;
    }

    if (node.children) {
        node.children.forEach(walk, this);
    }
}

describe('Tung', () => {
    jsdom();
    let inst;
    let container;
    
    beforeEach(() => {
        container = document.createElement('div');
        inst = new Tung(container);
    });
    
    it('simple page with no data', () => {
        inst.setView(simple);
        inst.setState({});
        let res = {};
        walk.call(res, inst.stateRender);
        
        assert.equal(res.div, 1);
    });
    
    it('simple page with data', () => {
        inst.setView(simple);
        inst.setState({
            btn: true,
            users: new Array(5).fill(1)
        });
        let res = {};
        walk.call(res, inst.stateRender);
        
        assert.equal(res.div, 8);
    });
    
    it('component with components with no data', () => {
        inst.setView(card);
        inst.setState({});
        let res = {};
        walk.call(res, inst.stateRender);
        
        assert.equal(res.div, 1);
        assert.equal(res.span, 1);
        assert.equal(res.img, 1);
    });
    
    it('component with components with data', () => {
        inst.setView(card, btn);
        inst.setState({btn: true});
        let res = {};
        walk.call(res, inst.stateRender);
        
        assert.equal(res.div, 1);
        assert.equal(res.span, 2);
        assert.equal(res.img, 1);
    });
    
    it('page with components with components with data', () => {
        inst.setView(page, card, btn);
        inst.setState({
            users: new Array(5).fill(1).map(it => ({ btn: true })),
            btn: true
        });
        let res = {};
        walk.call(res, inst.stateRender);
        
        assert.equal(res.div, 7);
        assert.equal(res.span, 11);
        assert.equal(res.img, 5);
    });
    
    it('blocks are set to els', () => {
        inst.setView(page, card, btn);
        inst.setState({
            users: new Array(5).fill(1).map(it => ({ btn: true })),
            btn: true
        });
        
        assert.equal(inst.els.users.length, 5);
        assert.equal(inst.els.btn.length, 6);
    });
    
    it('components are set to refs', () => {
        class Card extends Tung {
            constructor() {
                super();

                this.setView(card, btn);
            }
            init() {
                this.setState({});
            }
        };
        inst.setView(page, Card);
        inst.setState({
            users: new Array(5).fill(1).map(it => ({ btn: true }))
        });
        assert.equal(inst.refs.Card.length, 5);
    });

    it('components are remove from refs', () => {
        class Card extends Tung {
            constructor() {
                super();

                this.setView(card, btn);
            }
            init() {
                this.setState({});
            }
        };
        inst.setView(page, Card);
        inst.setState({
            users: new Array(5).fill(1).map(it => ({ btn: true }))
        });
        inst.state.users.pop();
        inst.state.users.pop();
        inst.setState(inst.state);
        console.log(inst.refs.Card)
        assert.equal(inst.refs.Card.length, 3);
    });
});
