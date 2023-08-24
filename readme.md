# Node-DATA-API Bundler

### Base URL - http://localhost:8000/api/dataApi

### Header - content-type: application/json

### body format:

```
{
    "fmServer":"<IpAddress>",
    "method":"<methodName>",
    "methodBody":{<method specific body>}
}

```

## Body Examples

- ## Signin

```
{
    "fmServer":"172.16.8.35",
    "method":"signin",
    "methodBody":{
        "username":"Admin",
        "password":"1234",
        "database":"DataApiTest"
    }
}
```

- ## Signout

```
{
    "fmServer":"172.16.8.35",
    "method":"signout",
    "methodBody":{
        "database":"DataApiTest",
        "token":"bf0465c3ced685ad1b8d35f76715c3965801b9bf188c94b359f8"

    }
}
```

- ## CreateRecord

```
{
    "fmServer":"172.16.8.35",
    "method":"createRecord",
    "methodBody":{
        "token":"84397ccff212c53098fc533a1e396bb55f574d71a02b172ca55",
        "database":"DataApiTest",
        "layout":"API_USER",
        "record":{
            "Name": "Kartik Aryan",
            "Phone": "7873333071",
            "Address":"Indore"
        }
    }
}
```

- ## GetAllRecords

```
{
    "fmServer":"172.16.8.35",
    "method":"getAllRecords",
    "methodBody":{
        "token":"84397ccff212c53098fc533a1e396bb55f574d71a02b172ca55",
        "database":"DataApiTest",
        "layout":"API_USER"

    }
}
```

- ## GetRecordsById

```
{
    "fmServer":"172.16.8.35",
    "method":"getRecordById",
    "methodBody":{
        "token":"a0bcfc8cf4c901e6cd16e0887d6f2e495deac6a79b8e6a6a926",
        "database":"DataApiTest",
        "layout":"API_USER",
        "Id":"5B6DD25D-7028-F740-9DC9-5BBC7075BB26"
    }
}
```

---

Important Docker Commands

- Build: `docker build . -t basudevbharatbhushan/node-data-api  `
- Run: `docker run -p 8000:8000 basudevbharatbhushan/node-data-api`
