import counter from 'reducers/counter'
import { addCounter } from 'reducers/counter'
import { List } from 'immutable'

describe('counter', () => {
    it("should increment counter", () => {
        expect(counter(undefined, {type: 'INCREMENT'})).toBe(1);
    })
})


describe('addCounter', () => {
    const listBefore = List([]);
    const listAfter = List([0]);

    it("should add a counter", () => {
        expect(addCounter(listBefore))
        .toEqual(listAfter);
    })
})
