import './macrowise.css'
import MoveTo from 'moveto'

const moveTo = new MoveTo()
const footer = document.getElementById('footer')

if (footer) {
	const trigger = document.getElementById('footer-trigger')
	const input = document.getElementById('newsletter-email')
	moveTo.registerTrigger(trigger, function () {
		input.focus()
	})
}

if (module.hot) {
	module.hot.accept()
}
