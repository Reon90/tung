import {Tung} from '../src/tung';
import btn from './tpl/components/btn';

class Button extends Tung {
    constructor(container) {
        super(container);

        this.setView(btn);
    }

    init() {
        this.setState({text: 'xxx'});
    }
}

export default Button;