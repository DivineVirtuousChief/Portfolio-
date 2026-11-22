# PetsApi

All URIs are relative to *https://api.example.test/v1*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createPet**](PetsApi.md#createpet) | **POST** /pets | Create a pet |
| [**getPetById**](PetsApi.md#getpetbyid) | **GET** /pets/{petId} | Get a pet by ID |
| [**listPets**](PetsApi.md#listpets) | **GET** /pets | List pets |



## createPet

> Pet createPet(newPet)

Create a pet

### Example

```ts
import {
  Configuration,
  PetsApi,
} from '';
import type { CreatePetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PetsApi();

  const body = {
    // NewPet
    newPet: ...,
  } satisfies CreatePetRequest;

  try {
    const data = await api.createPet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **newPet** | [NewPet](NewPet.md) |  | |

### Return type

[**Pet**](Pet.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Pet created. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPetById

> Pet getPetById(petId)

Get a pet by ID

### Example

```ts
import {
  Configuration,
  PetsApi,
} from '';
import type { GetPetByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PetsApi();

  const body = {
    // number
    petId: 789,
  } satisfies GetPetByIdRequest;

  try {
    const data = await api.getPetById(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **petId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**Pet**](Pet.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pet details. |  -  |
| **404** | Pet not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listPets

> Array&lt;Pet&gt; listPets(limit)

List pets

### Example

```ts
import {
  Configuration,
  PetsApi,
} from '';
import type { ListPetsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PetsApi();

  const body = {
    // number (optional)
    limit: 56,
  } satisfies ListPetsRequest;

  try {
    const data = await api.listPets(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **limit** | `number` |  | [Optional] [Defaults to `20`] |

### Return type

[**Array&lt;Pet&gt;**](Pet.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | A list of pets. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

