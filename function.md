# Functional Specifications: CMP-Core-reg6

This document outlines the core functionalities and system requirements for the **CMP-Core-reg6** application.

## 1. Authentication Module
* **1.1 User Login:** Users must authenticate using their registered credentials.
  * **Fields Required:** `Email` and `Password`.
  * **Email Format:** The email format typically incorporates the branch's postal code as an identifier (e.g., `64000@email.com`).

## 2. Signatory Management
* **2.1 Add Authorized Signatory:** A logged-in user can add and manage authorized signatories for their specific branch/account.
* **2.2 Signatory Data Fields:**
  * **Name:** Full name of the authorized person (e.g., *Mr. Game Thepmak*).
  * **Position:** Official job title (e.g., *Head of Sukhothai Provincial Post Office*).
  * **Signature Image:** An uploaded image file of the person's signature.
* **2.3 Attach to Documents:** These profiles are saved and can be selected to be appended to outgoing documents or printouts.

## 3. Customer Data Management
* **3.1 Customer Attributes:** The system stores and manages customer data containing the following primary fields:
  * `postCode`: The postal code associated with the customer (e.g., `64000`).
  * `postName`: The name of the post office or branch.
  * `customerName`: The name of the customer, organization, or entity (e.g., *Nakhon Sawan East Subdistrict Administrative Organization*).

## 4. Document Generation and Printing
* **4.1 Dynamic Data Fetching:** The system retrieves customer lists directly from the database.
* **4.2 Customizable Prefixes/Titles:** Before printing, the user can select or input a specific prefix/salutation to be placed in front of the `customerName`.
  * *Example Output:* "To: Mayor of [customerName]" (where `customerName` is dynamically pulled from the database).
* **4.3 Signatory Integration:** The generated document will automatically append the selected authorized signatory's Name, Position, and Signature image at the designated signature block.

## 5. Bulk Operations
* **5.1 Batch Printing:** Users can select multiple customers from the data grid simultaneously.
* **5.2 Batch Prefix Assignment:** Users can assign prefixes/titles to multiple selected customers at once before executing a bulk print job, streamlining the document generation process.

## 6. Access Control & Data Visibility
* **6.1 Role-Based Access by Postal Code (Data Isolation):** A logged-in user can only view, access, and print customer data that strictly matches their assigned `postCode`.
  * *Example:* If a user logs in with `64000@email.com`, the system filters the database and grants them access **only** to customers whose `postCode` is exactly `64000`. Cross-branch data access is strictly prohibited.
