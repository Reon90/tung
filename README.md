# tung

A javascript library for rendering html. Tung helps to divide html and javascript development. In order to start working with tung, you only need to know two methods, setView and setState.

## Install
```
npm install tung
```

**Of course, that you need to convert html to js.**
```
npm install babel-tung
```
There is config for [Webpack](https://webpack.github.io/) and [Gulp](http://gulpjs.com/)

## Features

&bull; based on [snabbdom](https://github.com/snabbdom/snabbdom), a fast and simple virtual DOM library;

&bull; pure html: block defines context, variables, components;

&bull; pure javascript: no jsx, defines only state for rendering html;

&bull; stateful and stateless components;

## Use cases
&bull; you don't like jsx;

&bull; you have html developers in your team;

&bull; you like [React](https://facebook.github.io/react/) patterns, but you looking for something different;

## Usage

[Demo](https://reon90.github.io/tung/examples/index.html)

```html
<!-- page.tpl -->
<div>
    <div class="users">
        <Card block="users" />
    </div>
    <Btn block="btn" />
</div>

<!-- btn.tpl -->
<span class="btn">{this.text}</span>

<!-- card.tpl -->
<div class="item item--admin">
    <img src={this.img} width="50" height="50" />
    <span class="item__content">{this.name}<span block="isAdmin"> &bull; admin</span></span>
    <Btn block="btn"/>
    <Btn block="delete"/>
</div>
```

```js
import {Tung} from 'tung';
import card from './card';
import page from './tpl/page';
import btn from './tpl/components/btn';

class Users extends Tung {
    constructor(container) {
        super(container);

        this.setView(page, btn, card); // IMPORTANT
        
        fetch('https://api.github.com/users/octocat/following')
            .then(response => response.json())
            .then(users => this.ready(users))
            .catch(console.error);
    }

    ready(users) {
        users[Symbol.iterator] = this.getUsers;
        this.usersIterator = users[Symbol.iterator]();

        this.setState({ // IMPORTANT
            users: [this.buildUser(this.usersIterator.next().value)],
            btn: {
                text: 'Load more',
                on: { click: this.handleEvent }
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
            onDeleteProfile: [this.onDeleteProfile, this]
        };
    }
    
    handleEvent(e) {
        let user = this.usersIterator.next();
        if (user.done) {
            delete this.state.btn;
        }
        this.state.users.push(this.buildUser(user.value));
        this.setState(this.state); // IMPORTANT
    }
    
    onDeleteProfile(e) {
        let index = this.state.users.findIndex(user => user.id === e.target.data.id);
        this.state.users.splice(index, 1);
        this.setState(this.state); // IMPORTANT
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
```

## API

### methods
| name      | argument | description                               |
|-----------|----------|-------------------------------------------|
| setView   | function | Defines which components will use         |
| setState  | object   | Render html from object                   |
### hooks (not called for root)
| name      | argument | description                               |
|-----------|----------|-------------------------------------------|
| init      | null     | Called when component was created         |
| destroy   | null     | Called when component was removed         |
### props
| name      | type     | description                               |
|-----------|----------|-------------------------------------------|
| refs      | object   | Stores stateful children components       |
| els       | object   | Stores DOM elements                       |
### html syntax
| name      | type     | description                               |
|-----------|----------|-------------------------------------------|
| block     | attribute| Name of context                           |
| Component | tag      | Name of component                         |
| this      | object   | Access to context                         |
### state properties
| name      | type     | description                               |
|-----------|----------|-------------------------------------------|
| on        | object   | ```{ on: { click: this.onClick } }```     |
| attrs     | object   | ```{ attrs: { placeholder: 'Text' } }```  |
| props     | object   | ```{ props: { data: { id: 12345 } } }```  |
| class     | object   | ```{ class: { toggle: true } }```         |
| style     | object   | ```{ style: { display: 'none' } }```      |

**Feel free to offer new features 🤔**
