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

/feed/page=1&limit=10 => 1-10 => .skip(0) & .limit(10)
/feed/page=2&limit=10 => 11-20 => .skip(10) & .limit(10)
/feed/page=3&limit=10 => 21-30 => .skip(20) & .limit(10)
skip = (page-1)*limit