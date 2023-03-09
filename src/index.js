import './style.css'
import { render } from './global-functions'
import { formatDistance, addWeeks, addDays, subDays } from 'date-fns'
import { sideMenu } from './side-menu/side-menu'

let distanceBetweenDatesInRealWords = formatDistance(addWeeks(new Date(), 5), new Date(), { addSuffix: true })

render(sideMenu)