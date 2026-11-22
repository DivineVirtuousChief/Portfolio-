# PortfolioPetstoreExampleApi.PetsApi

All URIs are relative to *https://api.example.test/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createPet**](PetsApi.md#createPet) | **POST** /pets | Create a pet
[**getPetById**](PetsApi.md#getPetById) | **GET** /pets/{petId} | Get a pet by ID
[**listPets**](PetsApi.md#listPets) | **GET** /pets | List pets



## createPet

> Pet createPet(newPet)

Create a pet

### Example

```javascript
import PortfolioPetstoreExampleApi from 'portfolio_petstore_example_api';

let apiInstance = new PortfolioPetstoreExampleApi.PetsApi();
let newPet = new PortfolioPetstoreExampleApi.NewPet(); // NewPet | 
apiInstance.createPet(newPet, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **newPet** | [**NewPet**](NewPet.md)|  | 

### Return type

[**Pet**](Pet.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## getPetById

> Pet getPetById(petId)

Get a pet by ID

### Example

```javascript
import PortfolioPetstoreExampleApi from 'portfolio_petstore_example_api';

let apiInstance = new PortfolioPetstoreExampleApi.PetsApi();
let petId = 789; // Number | 
apiInstance.getPetById(petId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **petId** | **Number**|  | 

### Return type

[**Pet**](Pet.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## listPets

> [Pet] listPets(opts)

List pets

### Example

```javascript
import PortfolioPetstoreExampleApi from 'portfolio_petstore_example_api';

let apiInstance = new PortfolioPetstoreExampleApi.PetsApi();
let opts = {
  'limit': 20 // Number | 
};
apiInstance.listPets(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **Number**|  | [optional] [default to 20]

### Return type

[**[Pet]**](Pet.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

