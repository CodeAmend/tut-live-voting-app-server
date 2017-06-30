import { List, Map } from 'immutable';

export function setEntries(state, entries) {
  return state.set('entries', List(entries))
}

function getWinners(vote) {
  if(!vote) return [];
  let [a, b] = vote.get('pair');
  let aVotes = vote.getIn(['tally', a], 0);
  let bVotes = vote.getIn(['tally', b], 0);
  if      (aVotes > bVotes) return [a]
  else if (aVotes < bVotes) return [b]
  else                      return [a, b]
}

export function next(state) {
  // Alter entries with winners
  const entries = state.get('entries')
    .concat( getWinners( state.get('vote') ));

  // console.log(entries);
  if(entries.size === 1) {
    return state.remove('vote')
                .remove('entries')
                .set('winner', entries.first());
  } else {
    return state.merge({
      vote: Map({ pair: entries.take(2) }),
      entries: entries.skip(2)
    });
  }

}

export function vote(state, choice) {
  return state.updateIn(
    ['vote', 'tally', choice], 0, tick => tick + 1
  );
}
