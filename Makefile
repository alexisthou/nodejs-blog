start:
	cd client && npm start&
	cd query && npm start&
	cd posts && npm start&
	cd comments && npm start&
	cd event-bus && npm start&
stop:
	pkill -f node