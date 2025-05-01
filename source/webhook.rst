Webhook Event Types
====================

This document outlines the webhook event types and their associated data structures.

Webhook Event Types
-------------------

- **CustomerBankTransfer**: Represents a customer bank transfer event.
- **MerchantBankTransfer**: Represents a merchant bank transfer event.
- **CustomerWalletDebited**: Represents an event where a customer's wallet is debited.
- **CustomerWalletCredited**: Represents an event where a customer's wallet is credited.
- **WalletToWalletTransfer**: Represents a wallet-to-wallet transfer event.
- **BatchBankTransfer**: Represents a batch bank transfer event.
- **AccountFunded**: Represents an event where an account is funded.

Webhook Event Data Structures
-----------------------------

### AccountFundedData

Represents the data structure for the `AccountFunded` event.

- **Amount** (`float64`): The amount funded.
- **SessionID** (`string`): The session ID associated with the funding.
- **ChannelCode** (`string`): The channel code used for the funding.
- **Status** (`string`): The status of the funding.
- **UserID** (`pgtype.UUID`): The user ID associated with the funding.
- **AccountName** (`string`): The name of the account.
- **AccountNumber** (`string`): The account number.
- **Reference** (`string`): The reference for the funding.
- **BankVerificationCode** (`string`): The bank verification code.

**Request JSON Example:**

.. code-block:: json

     {
         "amount": 1000.0,
         "sessionID": "abc123",
         "channelCode": "WEB",
         "status": "SUCCESS",
         "userId": "e0aec692-0de0-4857-b448-471645f46ebd",
         "accountName": "John Doe",
         "accountNumber": "1234567890",
         "reference": "REF12345",
         "bankVerificationCode": "BVC123"
     }

**Response JSON Example:**

.. code-block:: json

     {
         "statusCode": 201,
         "status": "success",
         "data": {
             "amount": 1000.0,
             "sessionID": "abc123",
             "channelCode": "WEB",
             "status": "SUCCESS",
             "userId": "e0aec692-0de0-4857-b448-471645f46ebd",
             "accountName": "John Doe",
             "accountNumber": "1234567890",
             "reference": "REF12345",
             "bankVerificationCode": "BVC123"
         }
     }

### WalletToWalletTransferData

Represents the data structure for the `WalletToWalletTransfer` event.

- **Amount** (`float64`): The amount transferred.
- **Reference** (`string`): The transaction reference.
- **Total** (`float64`): The total amount including fees.
- **TransactionFee** (`float64`): The transaction fee.
- **TargetCustomerID** (`string`): The ID of the target customer.
- **SourceCustomerID** (`string`): The ID of the source customer.
- **TargetCustomerWallet** (`string`): The wallet of the target customer.
- **SourceCustomerWallet** (`string`): The wallet of the source customer.
- **Description** (`string`): A description of the transfer.

**Request JSON Example:**

.. code-block:: json

     {
         "amount": 500.0,
         "reference": "WALLET123",
         "total": 505.0,
         "transaction_fee": 5.0,
         "target_customer_id": "target123",
         "source_customer_id": "source123",
         "target_customer_wallet": "wallet_target",
         "source_customer_wallet": "wallet_source",
         "description": "Payment for services"
     }

**Response JSON Example:**

.. code-block:: json

     {
         "statusCode": 201,
         "status": "success",
         "data": {
             "amount": 500.0,
             "reference": "WALLET123",
             "total": 505.0,
             "transaction_fee": 5.0,
             "target_customer_id": "target123",
             "source_customer_id": "source123",
             "target_customer_wallet": "wallet_target",
             "source_customer_wallet": "wallet_source",
             "description": "Payment for services"
         }
     }

### CustomerWalletCredited

Represents the data structure for the `CustomerWalletCredited` event.

- **Amount** (`float64`): The credited amount.
- **CustomerID** (`uuid.UUID`): The ID of the customer.
- **CustomerWalletID** (`uuid.UUID`): The wallet ID of the customer.
- **MerchantID** (`uuid.UUID`): The ID of the merchant.
- **Metadata** (`Metadata`): Additional metadata for the event.
- **Reference** (`string`): The transaction reference.
- **TransactionFee** (`float64`): The transaction fee.

**Request JSON Example:**

.. code-block:: json

     {
         "amount": 200.0,
         "customer_id": "customer123",
         "customer_wallet_id": "wallet123",
         "merchant_id": "merchant123",
         "metadata": { "key": "value" },
         "reference": "CREDIT123",
         "transaction_fee": 2.0
     }

**Response JSON Example:**

.. code-block:: json

     {
         "statusCode": 201,
         "status": "success",
         "data": {
             "amount": 200.0,
             "customer_id": "customer123",
             "customer_wallet_id": "wallet123",
             "merchant_id": "merchant123",
             "metadata": { "key": "value" },
             "reference": "CREDIT123",
             "transaction_fee": 2.0
         }
     }

### CustomerBankTransferData

Represents the data structure for the `CustomerBankTransfer` event.

- **Amount** (`float64`): The amount transferred.
- **Charges** (`float64`): The charges for the transfer.
- **CustomerID** (`string`): The ID of the customer.
- **Description** (`string`): A description of the transfer.
- **Destination** (`string`): The destination of the transfer.
- **MerchantID** (`string`): The ID of the merchant.
- **Metadata** (`CustomerTransferMetadata`): Additional metadata for the transfer.
- **PaidAt** (`string`): The payment timestamp (consider using `time.Time` for parsing).
- **Reference** (`string`): The transaction reference.
- **SessionID** (`string`): The session ID associated with the transfer.
- **Status** (`string`): The status of the transfer.
- **Total** (`float64`): The total amount including VAT and charges.
- **TransactionID** (`string`): The transaction ID.
- **TransactionReference** (`string`): The transaction reference.
- **VAT** (`float64`): The VAT amount.
- **WalletID** (`string`): The wallet ID associated with the transfer.

**Request JSON Example:**

.. code-block:: json

     {
         "amount": 1000.0,
         "charges": 50.0,
         "customerId": "customer123",
         "description": "Bank transfer payment",
         "destination": "Bank XYZ",
         "merchantId": "merchant123",
         "metadata": { "key": "value" },
         "paidAt": "2025-05-01T10:00:00Z",
         "reference": "BANK123",
         "sessionID": "session123",
         "status": "SUCCESS",
         "total": 1050.0,
         "transactionId": "txn123",
         "transactionReference": "BANK123",
         "vat": 0.0,
         "walletId": "wallet123"
     }

**Response JSON Example:**

.. code-block:: json

     {
         "statusCode": 201,
         "status": "success",
         "data": {
             "amount": 1000.0,
             "charges": 50.0,
             "customerId": "customer123",
             "description": "Bank transfer payment",
             "destination": "Bank XYZ",
             "merchantId": "merchant123",
             "metadata": { "key": "value" },
             "paidAt": "2025-05-01T10:00:00Z",
             "reference": "BANK123",
             "sessionID": "session123",
             "status": "SUCCESS",
             "total": 1050.0,
             "transactionId": "txn123",
             "transactionReference": "BANK123",
             "vat": 0.0,
             "walletId": "wallet123"
         }
     }