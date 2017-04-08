import {Tung} from '../src/tung';
import card from './tpl/components/card';
import btn from './tpl/components/btn';

class Card extends Tung {
    constructor(container) {
        super(container);

        this.setView(card, btn);
    }

    init() {
        this.setState(Object.assign({
            btn: {
                text: 'View profile',
                on: { click: this.handleEvent.bind(this) },
                props: { data: { url: this.props.url } }
            },
            delete: {
                text: 'Delete profile',
                on: { click: this.props.onDeleteProfile },
                props: { data: { id: this.props.id } }
            },
        }, this.props));
    }

    handleEvent(e) {
        window.open(e.target.data.url, 'profile', 'width=600,height=400');
    }
}

export default Card;