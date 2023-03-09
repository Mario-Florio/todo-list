import './style.css'
import { render } from './global-functions'
import { formatDistance, addWeeks, addDays, subDays } from 'date-fns'
import { navbar } from './navbar/navbar'

let distanceBetweenDatesInRealWords = formatDistance(addWeeks(new Date(), 5), new Date(), { addSuffix: true })

render(navbar)