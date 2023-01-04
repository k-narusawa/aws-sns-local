## AWS SNS LOCAL

AWS SNS Mock on local machine

## Usage

- Confirm sent SMS

```sh
❯ curl http://localhost:8006/store | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   125  100   125    0     0  15080      0 --:--:-- --:--:-- --:--:--  122k
[
  {
    "messageId": "e54703ee-59df-4816-879d-df4d04329a9f",
    "destination": "+818012345678",
    "message": "Hello World!",
    "at": 1672820830
  }
]
```
