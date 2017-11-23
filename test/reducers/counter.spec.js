import counter from 'reducers/counter'

describe('counter', () => {
    it("should increment counter", () => {
        expect(counter(undefined, {type: 'INCREMENT'})).toBe(1);
    })
})
