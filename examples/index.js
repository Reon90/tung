import {Tung} from '../src/tung';
import card from './card';
import page from './tpl/page';
import btn from './tpl/components/btn';

class Users extends Tung {
    constructor(container) {
        super(container);

        this.setView(page, btn, card);
        
        fetch('https://api.github.com/users/octocat/following')
            .then(response => response.json())
            .then(users => this.ready(users))
            .catch(console.error);
    }

    ready(users) {
        users[Symbol.iterator] = this.getUsers;
        this.usersIterator = users[Symbol.iterator]();

        this.setState({
            users: [this.buildUser(this.usersIterator.next().value)],
            btn: {
                text: 'Load more',
                on: { click: this.handleEvent.bind(this) }
            }
        });
    }
    
    buildUser(user) {
        return {
            name: user.login,
            img: user.avatar_url,
            url: user.html_url,
            isAdmin: user.site_admin,
            id: user.id,
            onDeleteProfile: this.onDeleteProfile.bind(this)
        };
    }
    
    handleEvent(e) {
        let user = this.usersIterator.next();
        if (user.done) {
            delete this.state.btn;
        }
        this.state.users[0].name = Math.random();
        this.state.users.push(this.buildUser(user.value));
        this.setState(this.state);
    }
    
    onDeleteProfile(e) {
        let index = this.state.users.findIndex(user => user.id === e.target.data.id);
        this.state.users.splice(index, 1);
        this.setState(this.state);
    }

    * getUsers() {
        for (let i = 0; i < this.length; i++) {
            if (this.length === i + 1) {
                return this[i];
            } else {
                yield this[i];
            }
        }
    }
}

new Users(root);