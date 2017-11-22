Basic Concepts of Redux:

1) Whole state as a SINGLE IMMUTABLE javascript OBJECT.

2) To modify the state of the application, dispatch an ACTION with the
required minimal change to the data.

3) Even if the change is because of a network request, you only
dispactch an action.

4) The ACTION is absorbed by a PURE function which must not have any
side-effects.
    - It doesn't change the arguments that are getting passed.
    - If you call it again with same arguments, it will give the exact
      same result every time.

5) This PURE function is called the REDUCER. Its takes the ACTION, the
current STATE and returns the NEXT STATE.


