import { createStore } from 'redux';

import reducers from '../reducers/index';

export default initState => createStore(reducers, initState,);
