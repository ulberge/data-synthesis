import * as store from '.';

let mockCuidId = '1';
jest.mock('cuid', () => () => mockCuidId);

describe('assets action creators', () => {
  it('should create an action to add assets', () => {
    const text = ['img1', 'img2'];
    const expectedAction = {
      type: 'ADD_ASSETS',
      payload: [
        { dataURL: text[0], id: mockCuidId },
        { dataURL: text[1], id: mockCuidId }
      ]
    };
    expect(store.addAssets(text)).toEqual(expectedAction);
  });
  it('should create an action to delete assets', () => {
    const expectedAction = {
      type: 'REMOVE_ASSETS'
    };
    expect(store.removeAssets()).toEqual(expectedAction);
  });
});

describe('assets reducers', () => {test
  it('should return the initial state', () => {
    const expectedState = {
      'items': []
    };
    // debugger;
    expect(store.assetsReducer(undefined, {})).toEqual(expectedState);
  });
});
