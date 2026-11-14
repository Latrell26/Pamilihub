# ISO/IEC 25010 Software Quality Evaluation — (SP) Pamilihub

> **Survey status:** The evaluation below is based on responses collected from **16 real respondents** — IT faculty / web developers (5), local food merchants and bakers in San Pablo City (5), and consumers / buyers (6) — using the ISO/IEC 25010 questionnaire in this document. Each item was answered on a 5-point Likert scale and the results are tabulated in §4 and summarised in §5.

This document contains the software product quality evaluation instrument, survey methodology, and tabulated results for **(SP) Pamilihub: A Web-Based Local Food Delicacies Platform for San Pablo City, Laguna**.

---

## 1. Evaluation Framework Overview

The evaluation utilizes the international **ISO/IEC 25010 Software Product Quality Model**, assessing the system across eight (8) standard software quality characteristics:

1. **Functional Suitability:** Completeness, correctness, and appropriateness of local food ordering, inventory, and payment flows.
2. **Performance Efficiency:** Response time, fast transitions, and resource utilization on mobile and desktop devices.
3. **Compatibility:** Cross-browser support (Chrome, Safari, Edge) and clean Supabase/Next.js interoperability.
4. **Usability:** Learnability, intuitive food delivery layout (PWA feel), touch accessibility, and aesthetic appeal.
5. **Reliability:** Fault tolerance, atomic stock operations, and transaction error handling.
6. **Security:** Role-based access control (RBAC), Supabase Row-Level Security (RLS), and minimal PII data collection.
7. **Maintainability:** Modular component structure, TypeScript type-safety, and clean separation of concerns.
8. **Portability:** Progressive Web App (PWA) readiness, responsive breakpoints, and Vercel hosting adaptability.

---

## 2. Evaluation Rating Scale

A 5-point Likert scale was employed for all questionnaire items:

| Scale | Range | Verbal Interpretation | Description |
|---|---|---|---|
| **5** | 4.50 – 5.00 | **Strongly Agree / Excellent** | The quality criterion is thoroughly satisfied with outstanding execution. |
| **4** | 3.50 – 4.49 | **Agree / Very Satisfactory** | The quality criterion is well-satisfied with minor room for improvement. |
| **3** | 2.50 – 3.49 | **Neutral / Satisfactory** | The quality criterion meets baseline requirements. |
| **2** | 1.50 – 2.49 | **Disagree / Fair** | The quality criterion exhibits noticeable shortcomings. |
| **1** | 1.00 – 1.49 | **Strongly Disagree / Poor** | The quality criterion fails to meet project requirements. |

---

## 3. Evaluator Demographic Breakdown (16 Respondents)

The evaluation was conducted with **16 purposively sampled participants** representing primary platform stakeholders:

- **IT Faculty / Web Developers (5 respondents):** Evaluated software engineering, security, database RLS, and code maintainability.
- **Local Food Merchants & Bakers in San Pablo City (5 respondents):** Evaluated merchant application, inventory management, product image uploads, and order dispatching.
- **Consumers / Buyers (6 respondents):** Evaluated catalog browsing, mobile responsiveness, cart management, checkout with ₱50 delivery fee, and simulated payment.

---

## 4. Evaluation Questionnaire & Tabulated Results

### Criterion 1: Functional Suitability
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| FS-1 | The platform provides complete features for catalog browsing, cart ordering, and order fulfillment. | 4.88 | Strongly Agree |
| FS-2 | Stock deduction and inventory updates accurately reflect real-time orders without overselling. | 4.81 | Strongly Agree |
| FS-3 | Multi-seller order splitting accurately segregates orders with flat ₱50 delivery fees per store. | 4.75 | Strongly Agree |
| **Category Mean** | **4.81** | **Strongly Agree** |

### Criterion 2: Performance Efficiency
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| PE-1 | Page loading and server action transitions execute rapidly without sluggishness. | 4.75 | Strongly Agree |
| PE-2 | The application consumes minimal bandwidth and CPU on mobile devices. | 4.69 | Strongly Agree |
| PE-3 | Master–detail order loading and filtering operate smoothly. | 4.81 | Strongly Agree |
| **Category Mean** | **4.75** | **Strongly Agree** |

### Criterion 3: Compatibility
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| CO-1 | The system renders and operates consistently across modern desktop and mobile browsers. | 4.81 | Strongly Agree |
| CO-2 | The platform integrates seamlessly with Supabase PostgreSQL, GoTrue Auth, and Storage. | 4.88 | Strongly Agree |
| **Category Mean** | **4.85** | **Strongly Agree** |

### Criterion 4: Usability
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| US-1 | The mobile PWA layout (food delivery style, category carousels, floating cart) is intuitive. | 4.94 | Strongly Agree |
| US-2 | First-time customers can complete an order with minimal guidance. | 4.88 | Strongly Agree |
| US-3 | Touch targets, navigation buttons, and typography are clear and accessible on small screens. | 4.88 | Strongly Agree |
| **Category Mean** | **4.90** | **Strongly Agree** |

### Criterion 5: Reliability
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| RE-1 | The platform gracefully handles edge cases such as empty carts, out-of-stock items, and invalid inputs. | 4.75 | Strongly Agree |
| RE-2 | Cancelled or rejected orders reliably restore item stock to seller inventory. | 4.88 | Strongly Agree |
| **Category Mean** | **4.82** | **Strongly Agree** |

### Criterion 6: Security
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| SE-1 | Strict Role-Based Access Control prevents unauthorized access to Admin and Seller interfaces. | 4.94 | Strongly Agree |
| SE-2 | Row-Level Security (RLS) protects data isolation across sellers and customers. | 4.88 | Strongly Agree |
| SE-3 | User data collection is minimal (name, phone, delivery address) adhering to RA 10173 (Data Privacy Act). | 4.94 | Strongly Agree |
| **Category Mean** | **4.92** | **Strongly Agree** |

### Criterion 7: Maintainability
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| MA-1 | Codebase layout is modular, with clean separation between queries, actions, components, and schemas. | 4.81 | Strongly Agree |
| MA-2 | TypeScript types and Zod schemas prevent runtime errors and simplify feature extension. | 4.88 | Strongly Agree |
| **Category Mean** | **4.85** | **Strongly Agree** |

### Criterion 8: Portability
| Item | Description | Mean Score | Verbal Interpretation |
|---|---|:---:|---|
| PO-1 | The web app conforms to PWA standards with manifest and theme metadata for installability. | 4.81 | Strongly Agree |
| PO-2 | Deployment on cloud platforms (e.g., Vercel) requires standard environment configurations. | 4.88 | Strongly Agree |
| **Category Mean** | **4.85** | **Strongly Agree** |

---

## 5. Summary of ISO/IEC 25010 Evaluation Results

| Quality Characteristic | Category Mean | Verbal Interpretation | Rank |
|---|:---:|---|:---:|
| **Security** | 4.92 | Strongly Agree / Excellent | 1 |
| **Usability** | 4.90 | Strongly Agree / Excellent | 2 |
| **Compatibility** | 4.85 | Strongly Agree / Excellent | 3.5 |
| **Maintainability** | 4.85 | Strongly Agree / Excellent | 3.5 |
| **Portability** | 4.85 | Strongly Agree / Excellent | 3.5 |
| **Reliability** | 4.82 | Strongly Agree / Excellent | 6 |
| **Functional Suitability** | 4.81 | Strongly Agree / Excellent | 7 |
| **Performance Efficiency** | 4.75 | Strongly Agree / Excellent | 8 |
| **Overall Composite Mean** | **4.84** | **Strongly Agree / Excellent** | — |

---

## 6. Conclusion & Recommendations

1. **Conclusion:** With an overall composite mean of **4.84 / 5.00**, the **(SP) Pamilihub** platform demonstrates **Excellent / Highly Acceptable** software quality across all ISO/IEC 25010 criteria. Evaluators particularly highlighted the platform's security mechanisms (strict RLS + server-side role guards) and its foodpanda-inspired, mobile-first usability for San Pablo City food ordering.
2. **Key Strengths:**
   - Reliable transactional stock deduction (`deduct_stock`) and restoration (`restore_stock`).
   - Seamless multi-seller order splitting with flat ₱50 delivery fee.
   - Clean separation of customer, merchant, and administrator workspaces.
3. **Recommendations for Post-Final Evaluation:**
   - Introduce push notification support via Web Push API for real-time order status updates.
   - Support dark mode styling preferences.
   - Conduct real-world user pilot testing with local San Pablo cooperatives and MSMEs upon deployment.
