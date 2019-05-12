setup:
	cd install -g serverless
	cd src && npm install

runserver:
	cd src && serverless offline start --stage dev
