# api list 

# auth router
- POST /signup
- POST /login
- POST /logout

# profile router
- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/password

# connection request router
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

# user router
- GET /connections
- GET /requests/received
- GET /feed
