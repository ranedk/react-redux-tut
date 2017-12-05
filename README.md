# A basic react-redux tutorial


## Principles of redux
- Whole state as a SINGLE IMMUTABLE javascript OBJECT.

- To modify the state of the application, dispatch an ACTION with the
required minimal change to the data.

- Even if the change is because of a network request, you only
dispactch an action.

- The ACTION is absorbed by a PURE function which must not have any
side-effects.
    - It doesn't change the arguments that are getting passed.
    - If you call it again with same arguments, it will give the exact
      same result every time.

- This PURE function is called the REDUCER. Its takes the ACTION, the
current STATE and returns the NEXT STATE.


## ImmutableJS
Not the best documented project, so putting in the most used concepts below.
It provides 5 basic types: List, Map, OrderedMap, Set, OrderedSet, Stack, Record

### Appending to list
```javascript

const langs = new Immutable.List(['python', 'ruby', 'php', 'c#', 'java']);
const newLangs = langs.push('golang');

console.log(">", langs.toString())
// > List [ "python", "ruby", "php", "c#", "java" ]

console.log(">", newLangs.toString())
// > List [ "python", "ruby", "php", "c#", "java", "golang" ]

console.log(">", langs.get(1));
// > ruby

console.log(">", langs.get(-2));
// > c#
```

### List of a list lookup
```javascript
const langs = [
  'assembly',
   [
       'c',
       'c++',
       'rust',
       [
           'java',
           'c#',
           [
               'python',
                'ruby'
           ]
       ]
   ]
];
const languages = new Immutable.fromJS(langs);
console.log(">", languages.getIn([1, 1]).toString());
// > c++

console.log(">", languages.getIn([1, 3, 2]).toString());
// > List [ "python", "ruby" ]

console.log(">", languages.getIn([1, 3, 2, 1]).toString());
// > ruby
```
You can use setIn to set values in this the nested-list structure.
This is a bad data structure from a coding practice perspective. Avoid using!

### Set at list index
```javascript
const langs = new Immutable.List(['python', 'ruby', 'php', 'c#', 'java', 'golang']);

langs1 = langs.set(2, 'garbage');
langs2 = langs1.set(3, 'who cares');
console.log(">", langs2.toString());
// > List [ "python", "ruby", "garbage", "who cares", "java", "golang" ]


langs3 = langs2.set(10, 'kotlin');
console.log(">", langs3.toString());
// > List [ "python", "ruby", "garbage", "who cares", "java", "golang", , , , , "kotlin" ]

langs4 = langs3.set(langs3.size, 'haskell');
console.log(">", langs4.toString());
// > List [ "python", "ruby", "garbage", "who cares", "java", "golang", , , , , "kotlin", "haskell" ]
```

### Other List operations
```javascript
const langs = new Immutable.List(['python', 'ruby', 'php', 'c#', 'java', 'golang']);

const langs1 = langs.push("rust")
console.log(">", langs1.toString())
// > List [ "python", "ruby", "php", "c#", "java", "golang", "rust" ]

const langs2 = langs1.shift()
console.log(">", langs2.toString())
// > List [ "ruby", "php", "c#", "java", "golang", "rust" ]

const langs3 = langs2.unshift("python")
console.log(">", langs3.toString())
// > List [ "python", "ruby", "php", "c#", "java", "golang", "rust" ]

const langs4 = langs3.delete(2);
console.log(">", langs4.toString())
// > List [ "python", "ruby", "c#", "java", "golang", "rust" ]

const langs5 = langs4.concat(['haskell', 'elm', 'scala']) //can also be Immutable.List(['haskell', 'elm', 'scala'])
console.log(">", langs5.toString())
// > List [ "python", "ruby", "c#", "java", "golang", "rust", "haskell", "elm", "scala" ]

const langs6 = langs5.merge(['Ubuntu', 'Windows'], ['OSX']);
console.log(">", langs6.toString())
// > List [ "OSX", "Windows", "c#", "java", "golang", "rust", "haskell", "elm", "scala" ]

const langs7 = langs5.mergeWith((a, b, index) => {
    return a.startsWith('U') ? a : b;
}, ['Ubuntu', 'Windows'], ['OSX']);
console.log(">", langs7.toString())
// > List [ "Ubuntu", "Windows", "c#", "java", "golang", "rust", "haskell", "elm", "scala" ]

const langs8 = langs7.clear();
console.log(">", langs8.toString())
// > List []
```
### Map - Associative arrays - Dictionaries
```javascript
const tuple = [
  ['js', 'Javascript'],
  ['py', 'Python'],
  ['php', 'PHP']
];
const fromTuple = Immutable.Map(tuple);
console.log(">", fromTuple.toString())
// > Map { "js": "Javascript", "py": "Python", "php": "PHP" }

const dict = {
  'js': 'Javascript',
  'py': 'Python',
  'php': 'PHP'
};
const fromDict = Immutable.Map(dict);
console.log(">", fromDict.toString())
// > Map { "js": "Javascript", "py": "Python", "php": "PHP" }

const obj = {
    'id': 1,
    'languages': [
        {
            'name': 'Javascript',
            'short': 'JS'
        },
        {
            'name': 'Python',
            'short': 'PY'
        },
        {
            'name': 'Php',
            'short': 'PHP'
        }
    ],
    'os': [
        'windows', 'linux', 'osx'
    ]
}
const iObj = Immutable.fromJS(obj)  // creates a deep mutable object
console.log(">", iObj.toString())
// > Map { "id": 1, "languages": List [ Map { "name": "Javascript", "short": "JS" }, Map { "name": "Python", "short": "PY" },

const iObj1 = Immutable.fromJS(iObj) // You can wrap multiple times and its fine
```

### Map Operations
```javascript
const obj = {
  'js': { name: 'Javascript', primary: 'Browser' },
  'py': { name: 'Python', primary: 'Backend' },
  'php': { name: 'PHP', primary: 'Hobby' }
};
const o = Immutable.fromJS(obj);
console.log(">", o.toString());
// > Map { "js": Map { "name": "Javascript", "primary": "Browser" }, "py": Map { "name": "Python", "primary": "Backend" }, "php": Map { "name": "PHP", "primary": "Hobby" } }

console.log(">", o.get('java', 'Javascript'));  // default value of key
// > Javascript

console.log(">", o.get('php', {'name': 'PersonalHomePage', primary: 'Hobby'}).toString());
// > Map { "name": "PHP", "primary": "Hobby" }

console.log(">", o.get('js').get('name'))   // Deep lookup
// > Javascript


console.log(">", o.has('kt'));  // If key exists
// > false

console.log(">", o.includes(Immutable.Map({name: 'Python', primary: 'Backend'}))); // Value lookup
// > true

o.keySeq().forEach(i => console.log(i))  // looping keys
//  js py php

o.valueSeq().forEach(i => console.log(i.toString()))  // looping values
// Map { "name": "Javascript", "primary": "Browser" }
// Map { "name": "Python", "primary": "Backend" }
// Map { "name": "PHP", "primary": "Hobby" }

o.entrySeq().forEach(e => console.log(e[0], e[1].toString()));
// js Map { "name": "Javascript", "primary": "Browser" }
// py Map { "name": "Python", "primary": "Backend" }
// php Map { "name": "PHP", "primary": "Hobby" }

const o1 = o.set('js', {name: 'Javascript', primary: 'NodeJS'})  // Set key value

var languages = Immutable.fromJS({'js': 'javascript', 'py': 'python'})
var updated = languages.merge({'java': 'Java', 'cpp': 'C plus plus'}, {'cpp': 'C++'})
console.log(">", updated.toString());
// > Map { "js": "javascript", "py": "python", "java": "Java", "cpp": "C++" }

```

### Sets
```javascript
const s = Immutable.Set(['python', 'java', 'python'])
console.log(">", s.toString());
// > Set { "python", "java" }

const s1 = s.union(['python', 'c++'])
console.log(">", s1.toString());
// > Set { "python", "java", "c++" }

const s3 = s1.intersect(['golang', 'python', 'java'])
console.log(">", s3.toString());
// > Set { "python", "java" }

const s4 = s3.add('python')
console.log(">", s4.toString());
// > Set { "python", "java" }

const s5 = s4.add('clojure')
console.log(">", s5.toString());
// > Set { "python", "java", "clojure" }
```


## React-Redux folder structure

### Priciples:
* All configs at the base folder
* Common utils and components at parent levels
* Projects are completely independent entities
* Apps are parts of project with logic level separation
* Apps to only have routes and components, logic in project level reducers
* All actions for a project in one place


#### Structure

- root
    - node_modules
    - webpack.config.js
    - webpack.config.production.js
    - dist
    - common
        - utils
        - components
        - middleware
    - types
    - route.js
    - projects
        - *project*
            - components
            - store
            - reducers
            - middleware.js
            - actions 
            - route.js
            - constants.js
            - string.json
            - apps
                - *app*
                    - route.js
                    - components