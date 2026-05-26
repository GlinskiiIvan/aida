import { createRoot } from 'react-dom/client'
import './ui/reset.css'
import './ui/tokens.css'
import './ui/index.css'

import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './routes'
import { Provider } from 'react-redux'
import { store } from './store/store'
import i18n from './i18n'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({});

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <BrowserRouter>
          <AppRouter />
      </BrowserRouter>
    </Provider>
)
