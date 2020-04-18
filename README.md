# \<minesweeper-app\>

The game of minesweeper as a web app with super high load performance, even on a Moto G4 with Slow 3G: https://webpagetest.org/result/200404_Z4_f836b0bd3220f1c0f7a4122491a675ef/

## Getting Started

```
git clone https://github.com/Westbrook/minesweeper.git
cd minesweeper
yarn && yarn start
```

## Building Your Application

```
$ yarn build
```

This will create builds of your application in the `dist/` directory, optimized to be served in production. You can then serve the built versions using your favorite HTTP server, if you've got the Polymer CLI installed globally, you can access it to run the built assets via the following:

```
$ polymer serve dist
```

## Running Tests

```
$ yarn test
```
