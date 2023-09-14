# Filemaker-DATA-API Bundler using Node JS

### Base URL - https://dataapi-o2iw.onrender.com/api/dataApi

### Header

- content-type: application/json
- Authorization: Bearer Base64Encoded(<UserName:Password>)

**NOTE:** : Session Token in body is optional, if session token is provided and flag is empty/false, it will try to call API with the provided session, if provided session is not valid, it will create a new session and return it.

### body format:

```
{
    "fmServer":"<IpAddress>",
    "method":"<methodName>",
    "methodBody":{<method specific body>},
    "session":{
        "token":"<sessionToken>",
        "required":<true/false>
    }
}

```

## Body Examples

- ## Signin

```
{
    "fmServer":"<IpAddress>",
    "method":"signin",
    "methodBody":{
        "username":"<Username>",
        "password":"<Password>",
        "database":"<Filemaker_Filename>"
    },
    "session":{
        "token":"<sessionToken>",
        "required":<true/false>
    }

}
```

- ## Signout

```
{
    "fmServer":"<IpAddress>",
    "method":"signout",
    "methodBody":{
        "database":"<Filemaker_Filename>",
    },
    "session":{
        "token":"<sessionToken>",
        "required":"<true/false>"
    }
}
```

- ## CreateRecord

```
{
    "fmServer":"<IpAddress>",
    "method":"createRecord",
    "methodBody":{
        "database":"<Filemaker_Filename>",
        "layout":"<Layout_Name>",
        "record":{
            "Name": "Varun Sharma",
            "Phone": "11111111111",
            "Address":"Newyork"
        }

    },
    "session":{
        "token":"<sessionToken>",
        "required":<true/false>
    }
}


```

- ## GetAllRecords

```
{
    "fmServer": "<IpAddress>",
    "method": "getAllRecords",
    "methodBody": {
        "database": "<Filemaker_Filename>",
        "layout": "<Layout_Name>",
        "offset":"1",
        "limit": 10

    },
    "session": {
        "token": "<sessionToken>",
        "required": <true/false>
    }
}
```

- ## FindRecord

```
{
    "fmServer":"<IpAddress>",
    "method":"findRecord",
    "methodBody":{
        "database":"<Filemaker_Filename>",
        "layout":"<Layout_Name>",
         "offset": 0,
         "limit": 0,
         "layout.response": "string",
        "dataformats":0,
        "query":[
            {"Name": "=Basudev", "Password": "=1234"},
             {"Phone" : "11111111111", "omit" : "false"}
         ],
        "sort":[
             {"fieldName": "CreationTimestamp","sortOrder": "ascend"}
         ],
        "scripts":{
            "script": "<FM_Script1>",
            "script.param": "<Script1_Param>"
             "script.prerequest": "<FM_Script2>",
             "script.prerequest.param": "<Script2_Param>",
             "script.presort": "<FM_Script3>",
             "script.presort.param": "<Script3_Param>"
        },
         "portal": [
             "<PortalName>"
         ]
    },
    "session":{
        "token":"<sessionToken>",
        "required":<true/false>
    }
}
```

---

- ## ExecuteScript

```
{
    "fmServer":"<IpAddress>",
    "method":"executeScript",
    "methodBody":{
        "database":"<Filemaker_Filename>",
        "layout":"<Layout_Name>",
        "script": "<ScriptName>",
        "param":"<ScriptParam>"
    },
    "session":{
        "token":"<sessionToken>",
        "required":<true/false>
    }
}
```

---
