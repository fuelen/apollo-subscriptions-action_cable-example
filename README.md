# Example app with GrapqhQL subscriptions and ActionCable

## Instructions

* Start rails server
* Install client

```
yarn install
```
* And run
```
yarn start
```

* Go to rails console and run
```
YourAppSchema.subscriptions.trigger('templateWasCreated', {}, Template.first)
```
