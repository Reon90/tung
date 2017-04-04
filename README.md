# tung

View

## Usage

```
import {Tung} from 'tung';
import page from './tpl/page';
import btn from './tpl/components/btn';

class Article extends Tung {
    constructor(container) {
        super(container);

        this.setView(page, btn);
        
        fetch('https://api.github.com/users/octocat/following')
            .then(data => this.ready(users))
            .catch(console.error);
    }

    ready(users) {
        this.setState({
            users: users.map(this.buildUser),
            btn: {
                text: 'Add',
                on: { click: this }
            }
        });
    }
    
    buildUser(user) {
        return {
            name: user.login,
            img: user.avatar_url,
            url: user.html_url
        };
    }
    
    handleEvent(e) {
        this.state.users.push(user);
        setState(this.state);
    }
}
```
