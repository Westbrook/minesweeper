export const squareMachine = {
  initial: 'INIT',
  states: {
    INIT: {
      on: {
        MINE: 'MINE',
        NOT_MINE: 'NOT_MINE',
      },
    },
    NOT_MINE: {
      on: {
        MARKED: 'MARKED',
        PLAYED: 'PLAYED',
      },
    },
    MINE: {
      on: {
        MARKED: 'MARKED_MINE',
        PLAYED: 'TRIPPED',
      },
    },
    MARKED: {
      on: {
        UNMARKED: 'NOT_MINE',
      },
    },
    PLAYED: {
      on: {},
    },
    MARKED_MINE: {
      on: {
        UNMARKED: 'MINE',
      },
    },
    TRIPPED: {
      on: {},
    },
  },
};

export const squareTransition = (state, event) => {
  if (!state) return squareMachine.initial;
  return squareMachine.states[state].on[event] || state;
};
