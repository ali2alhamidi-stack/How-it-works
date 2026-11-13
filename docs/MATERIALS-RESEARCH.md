# Printing/signage material, stock and calculator research

Read-only research and proposed design for the next phase. Checked 2026-11-13 using official manufacturer product pages and technical publications. No previous delivery was edited. No local stock, supplier availability, purchase price, selling price, universal product specification or completed backend is asserted here.

## Material families supported by primary sources

| Family and official evidence | Candidate template, explicitly not live stock | Data the app must preserve |
|---|---|---|
| Acrylic — PLEXIGLAS GS/XT [S1] | GS cast clear: 3050×2030mm, choose a published thickness such as 3mm. XT extruded clear: 3050×2050mm, choose a published thickness such as 3mm. | Manufacturing process is a real variant (`cast` vs `extruded`), not merely a description. Keep grade, dimensions, thickness and finish separate. These are PLEXIGLAS examples, not universal acrylic sheet sizes. |
| PVC foam — Palram PALIGHT [S2] | PALIGHT Print, white printing-grade foam PVC sheet; local supplier must provide the actual thickness and sheet size. | Distinguish Print / Colors / Outdoor / Build grade. Finish, density if documented, surface/ink suitability and indoor/outdoor application are SKU attributes. Do not default every foam PVC board to one thickness or application rating. |
| Aluminum composite — 3A DIBOND [S3] | DIBOND display panel; choose the actual supplier's product variant before setting dimensions/total thickness. | Core material and aluminum skin thickness are distinct from total panel thickness. Official description identifies two 0.3mm aluminum cover layers and polyethylene or mineral core. Do not apply this construction to all generic ACP, or infer certification from the category name. |
| Polyester/backlit roll — HP [S4] | HP Backlit Polyester Film CR660B: 914mm×30.5m, 220µm, matte; source lists 275g/m² and UPC 848412012521. | Film chemistry, coating, printer/ink compatibility, thickness, GSM, finish, transparency/application, core diameter, width and nominal length. This example is polyester, not an interchangeable vinyl banner. |
| Self-adhesive vinyl — Avery Dennison MPI 1105 [S5] | MPI 1105 wrapping film family, gloss white cast film; choose the current regional SKU and actual roll dimensions from the supplier. | Cast/calendered method, adhesive type, liner, color/finish, printed face thickness, laminate pairing and printer compatibility. A liner's GSM is not the face film's GSM. Do not turn conditional durability claims into generic stock attributes. |
| Banner roll — HP Opaque Scrim [S6a/S6b] | Q1902C, nominal 1524mm×15.2m matte vinyl banner; GSM requires verification because official pages conflict. | Frontlit/backlit/blockout classification, single/double-sided print, coating, width, length, GSM and thickness are independent. Do not silently pick one conflicting weight. |
| Paper — Mondi Color Copy / Mohawk [S7/S8] | Color Copy original white digital paper, with a documented format and a chosen GSM from its 80–400g/m² range. Local packaging count must be entered from the actual supply unit. | GSM is mass/area; caliper is thickness. Paper stock kind (`text`, `cover`, etc.), finish, grain direction, coating, sheet format and sheets/pack matter. Do not assume every ream/package contains 500 sheets. |
| Ink — Epson GS3 [S9] | Epson GS3 ink, actual color and printer-compatible cartridge/pack SKU, selected documented capacity (family offers up to 700mL cartridges or 1.5L packs depending on model). | Chemistry/family, color channel, printer compatibility, container nominal mL, batch, expiry/opened date and maintenance consumption. Nominal pack capacity is not guaranteed saleable print consumption. |
| LED module — SloanLED [S10/S11] | SloanLED SE 701269-6WSK1-MB, 12VDC, 0.43W/module, source-specific 50-module tray. Keep datasheet revision with the template. | Voltage, power/module, CCT, optics, module spacing/depth guidance, pack/chain counts and manufacturer PSU compatibility limits. Published source is an older product reference; revalidate before purchase/use. |
| DC power supply — Mean Well / SloanLED [S11/S12] | Mean Well LPV-60-12, 12VDC, 5A, 60W, constant-voltage supply; example only, subject to actual environment and current datasheet. | Model is not sufficient to infer watts: LPV-60-5 is rated 40W despite the family name. Store output channels and each channel's V/A/W constraints, manufacturer derating and conditions. |
| Gift blanks — Unisub [S13/S14] | Unisub 5995 aluminum rectangle keychain: 40.6×57.1mm, 1.14mm, white gloss, source quantity 50; stock base remains individual pieces with a pack conversion. | Blank shape, substrate, coating/print process, printable sides, jig/template, thickness, actual blank size and pack quantity. Use manufacturer-specific pressing instructions rather than a universal heat/time setting. |

All templates should be created with `isTemplate:true`, `verificationStatus:'needs_supplier_confirmation'`, stock quantity zero, costs/prices null, and cited source plus date/revision. A manager explicitly verifies and activates a supplied SKU before it becomes operational stock. A zero or missing price must not be presented as a free material.

## Proposed catalog/stock schema

Separate the service catalog, a material's identity, its supplied packaging, physical stock and accounting/operational movements. One overloaded `quantity` field cannot safely describe unopened rolls, cut rolls, sheets, offcuts, packs and liquid containers.

| Entity | Actionable fields |
|---|---|
| `MaterialCategory` | `id, parentId, code, nameAr, materialFamily, allowedForms, attributeSchema, defaultCalculator` |
| `MaterialSKU` | `tenantId, id, sku, nameAr, manufacturer, brand, manufacturerPartNo, categoryId, form(sheet/roll/piece/liquid/strip/module/powerSupply), baseUom, quantityScale, active, isTemplate, verificationStatus, notes` |
| Identity/scanning | `barcodes:[{value,symbology,uom,packFactor,scope}]`; keep leading zeros as text; local internal barcode separate from manufacturer UPC/GTIN; validate check digit for claimed GTIN; distinguish item, carton, lot and asset scans. |
| Variant attributes | `composition, grade, process(cast/extruded/etc), widthMm, lengthMm, thicknessMm, grammageGsm, colorCode, colorName, finish, printableSides, adhesiveType, liner, grainDirection, rotationAllowed, coreDiameterMm, compatibleInkFamilies, compatiblePrinterModels` |
| Electrical extension | `voltageDC, constantVoltageOrCurrent, wattsPerModule, wattsPerMeter, currentAmps, cctK, ipRating, cutIncrementMm, maxFeedLengthMm, maxUnitsPerChain, compatibleSupplyModels, outputs:[{channel,volts,maxAmps,maxWatts,maxUnits}], deratingProfile` |
| `Packaging` / conversion | `id, skuId, purchaseUom, baseUom, baseUnitsPerPack, packBarcode, breakPackAllowed, minimumPurchasePacks, nominalWidthMm, nominalLengthMm, containerMl`. Quantity conversion belongs to a particular SKU/package revision, not to the word “box” or “roll.” |
| `SupplierOffer` | `supplierId, skuId, supplierSku, supplierBarcode, purchasePackId, currency, unitCost, taxTreatment, freightAllocation, leadTimeDays, moq, quoteValidUntil, sourceDocumentId`. Prices nullable until confirmed. |
| `StockLot` | `id, tenantId, branchId, skuId, supplierId, supplierLotNo, receivedAt, receiptId, expiryAt, openedAt, unitCostSnapshot, landedCostSnapshot, currency, sourceDocumentId, qualityStatus, locationId` |
| `StockAsset` | `id, lotId, assetBarcode, form, parentAssetId, originalWidthMm, originalLengthMm, remainingLengthMm, actualGeometry, quantityBase, condition, locationId, status`. Individually identify each partial roll, high-value sheet and confirmed offcut. |
| `Reservation` | `id, tenantId, branchId, orderId, skuId, assetId, lotId, quantityBase, reservedGeometry, status, createdBy, createdAt, expiresAt, version` |
| `StockMovement` | `id, operationId, tenantId, branchId, skuId, lotId, assetId, orderId, type(receive/issue/return/waste/cut/transfer/adjust), quantityBase, netUsedBase, wasteBase, recoverableBase, costSnapshot, actorId, occurredAt, reason, evidenceMediaIds, reversesId` |
| `ReorderRule` | `branchId, skuId, minimumAvailableBase, targetAvailableBase, leadTimeDays, preferredSupplierId, reorderMultiplePack, safetyStockBase` |
| `SourceDocument` | `manufacturer, title, url, region, productCode, revision, effectiveAt, checkedAt, approvedBy, approvedAt, attachmentHash, extractedFields, conflicts[]`. Distinguish a manufacturer's value, supplier claim, measured actual and operator assumption. |

A tenant may maintain shared SKU definitions with per-branch lot/asset stock. The platform-owner provisioning portal should configure tenant access and optionally publish template libraries; it should not silently merge branch balances or read customer production data without an explicitly authorized support workflow. Every runtime record is tenant-scoped; no tenant ID supplied by the client grants access.

### Base-unit recommendations

- Sheets/paper: base `sheet`, integer. Packaging (ream/carton) converts by its documented count. Track offcuts as child assets with dimensions, not fractional “0.4 sheet” without a footprint. Derive area for costing and reporting separately.
- Rolls: consumption base `mm` or another fixed decimal length unit; each physical roll is a container/asset with its width and actual remaining length. “One roll” is a purchase package with SKU-specific length. Derived area is width × length; a short roll of one width is not interchangeable with equal area of another width.
- Ink: `mL` or a finer configured fixed-point volume unit; cartridge/pack is a container. Count unopened containers separately from remaining usable liquid if measured/estimated. Empty/maintenance losses are recorded, not hidden.
- Gift blanks, LED modules and supplies: base `piece`, integer. Strip: base length with manufacturer cut increment and a physical reel asset. Modules per chain and modules per tray are separate concepts.
- Store lengths in integer µm or fixed-point mm and quantities as decimal/fixed-point with an explicit scale. Never use binary floating-point equality for stock conservation. Store unit costs at sufficient decimal precision and final monetary totals in currency minor units; snapshot conversion and costing versions on each movement/quote.

## Non-negotiable stock invariants (design proposals)

1. `usableOnHand` excludes quarantined, expired/unusable and scrapped stock. `reserved` is a subset of usable stock, not an additional balance. `available = usableOnHand − activeReserved`, always nonnegative. Show quarantined and waste separately; do not sum overlapping buckets as stock.
2. Finished products and raw materials are different SKUs/stock states. Raw consumption cannot also remain available as a finished item without an explicit production transformation.
3. One atomic issue posts stock decrement, cost snapshot, order consumption and audit. `totalIssued = netUsed + irreversibleWaste + recoverableReturn`, with recoverable returns posted back exactly once as identifiable stock. Waste is a subset of issued stock; do not decrement stock once for the issue and again for the same waste.
4. A sheet-cut operation retires/depletes its parent asset and creates traceable remnants. Parent and children cannot both remain fully available. For rectangular plans, finished area + retained offcut area + kerf/scrap area must reconcile with parent area within an explicit tolerance. Saved offcuts require measured size/shape and operator confirmation; estimated “waste area” from a quote is not automatically a usable remnant.
5. An individual remnant has at most one active exclusive reservation. Bulk quantities can have multiple reservations only while their total stays within usable on-hand. Both cases require a transaction/conditional update and tenant/branch/material compatibility checks.
6. A transfer is two balanced sides linked by one transfer ID, with explicit in-transit state; it is not an unrelated adjustment in each branch. A cancelled order releases active reservations, and actual issues are reversed/returned explicitly rather than deleted.
7. Receipt/issue/cut/transfer uses idempotency keys plus database uniqueness and optimistic versions/row locks. Replaying or racing the same request must not duplicate balance or cost effects. History is append-only with compensating corrections and a reason.
8. Package conversions are positive and dimensionally valid. A sheet-to-area derivation requires its dimensions; a roll-to-length conversion requires that SKU/pack's length; a mass-to-volume conversion requires documented density and conditions. No generic conversions between “piece,” “m²,” “m,” and “mL.”
9. SKU is unique within a tenant; barcode lookup resolves one active interpretation per tenant and package context. Do not make the same manufacturer barcode point to different pack factors without explicit version/context selection. GTIN is an external identifier, not an automatically assigned local SKU.
10. Reorder uses unreserved usable stock and inbound approved quantities according to a stated policy. It must not treat every requested purchase as received supply. Supplier MOQ and pack multiple round purchasing quantities, not raw production consumption.

## Calculator improvements informed by the sources

### Sheets/paper

Preserve `finishedSize`, `bleed`, `edgeTrim`, `kerfGap`, `gripperMargin`, `grainDirection` and machine profile as separate values. The current simple two-orientation grid remains a transparent baseline. Future mixed nesting must state its algorithm and limitation, respect orientation/face/grain constraints and return actual placements/retained remnants. Bill a full purchased sheet when required, while separately showing material consumed and recoverable offcuts. Never claim optimal nesting from a grid calculation.

GSM does not determine thickness. Paper estimated mass in grams = area in m² × GSM × sheet count. Example of the formula, not a supplier pack: 500 A4 sheets at 80GSM have theoretical paper mass 2,494.8g before packaging/moisture variation. Package count is entered independently; US basis weights require stock kind/basis dimensions and cannot be converted from “80lb” alone [S8].

### Roll media

Use actual printable width (physical width minus machine margins) and configured leader/trailer, registration/ink-bar and inter-job gaps. Charge full-width consumed roll length, including the last partial row. Report net printed area, physical stock area, layout loss and additional process loss independently. Allocate only to compatible physical roll assets; several short remnants cannot be presented as one continuous length. Print rotation must be explicitly permitted for the job/material/printer.

### Ink

Epson explicitly says consumption varies with image, settings, media, frequency and environment and includes maintenance [S9]. Use a calibrated printer/media/mode profile or RIP/telemetry record for each color channel, plus configurable cleaning/priming loss. Distinguish estimate from measured usage. Do not apply one universal mL/m² constant or assume nominal cartridge volume is fully printed. Save calibration date and units with the quote.

### LED and power supplies

Model power supplies as outputs/channels, not just a single summed watt number. SloanLED's 120D1 table uses two 60W outputs, so two independent limits cannot be pooled into one 120W channel [S11]. A module belongs wholly to one compatible-voltage output; enforce per-output watts/current, the manufacturer's maximum modules, max-chain length/count and environmental derating simultaneously. Required supplies cannot be computed by `ceil(totalWatts / totalUsableWatts)` alone.

SloanLED's published capacity chart specifies 90% for the listed products [S11]; 80% is therefore a configurable planning policy, not a universal manufacturer rule. Mean Well LPV is constant-voltage, with different voltage/current variants [S12]. Store manufacturer/installer-approved conditions; do not auto-combine unlike voltages, parallel outputs or equate current-source and voltage-source drivers. Module density is an estimate until the actual face/depth/layout is tested, as the SE guide itself explains [S10].

For strips, the cut increment, maximum single feed length and allowed feed grouping must come from the selected product; a default one-meter segment is only an explicit operator assumption until verified. Purchase full reels, plan installed length, and track retained reel length separately.

### Pricing

Separate raw material cost, waste cost, machine time, direct labor, outsourced finishing, setup, overhead and tax. Markup is `(price−cost)/cost`; contribution margin is `(price−directCost)/price`; neither is net accounting profit. Service reference rates and material SKU purchase costs are different tables. Preserve quote versions and cost snapshots so later supplier changes do not rewrite historical orders. Null/unconfirmed costs must visibly block a complete reliable cost estimate or carry a stated provisional assumption.

## Source registry (exact URLs and tool reference IDs)

Only official sources were used for the findings. Some older PDFs are useful model-specific evidence, not proof of current market availability. Root should open sources directly before citing them in its user-facing answer.

- **S1 — PLEXIGLAS GS/XT manufacturer sizes and cast/extruded distinction.** https://www.plexiglas.de/en/products/plexiglas/plexiglas-gs-xt — `turn324611398search0`, opened as `turn214553201view0`. Technical sheet (04/25): https://www.plexiglas.de/files/plexiglas-content/pdf/technische-informationen/211-1-EN-PLEXIGLAS-GS-XT.pdf — `turn324611398search5`.
- **S2 — Palram PALIGHT foam PVC grade families and applications.** https://www.palram.com/product/palight-pvc-flat-sheets/ — `turn324611398search1`, opened as `turn214553201view1`.
- **S3 — 3A DIBOND construction.** https://www.display.3acomposites.com/en/products/by-brand/dibond-r/ — `turn641813912search7`, opened as `turn214553201view2`. Manufacturer guide: https://media.3acomposites.com/pdf/3AComposites/EN_3AC_DISPLAY_ProductGuide_01-2020.pdf — `turn324611398search6` / `turn641813912search9`.
- **S4 — HP Backlit Polyester Film dimensions, weight, thickness, compatibility, UPC.** https://support.hplfmedia.com/docs/hp-backlit-polyester-film — `turn324611398search2`, opened as `turn214553201view3`. Product page: https://hp.globalbmg.com/en/hp-backlit-polyester-film — `turn324611398search3`.
- **S5 — Avery MPI 1105 cast self-adhesive wrapping film.** https://graphics.averydennison.com/en/home/graphics-products/digitally-printable-films/supercast-digital-color-graphics/mpi-1105-opaque-series-films.html — `turn129174297search0`. Regional 07/2021 technical sheet: https://graphics.averydennison.com/content/dam/averydennison/graphics/eu/Avery-Dennison/01.%20Digital/MPI/MPI%201105/MPI%E2%84%A2%201105%20Wrapping%20series_EN%20%28AD-Public%29.pdf — `turn129174297search8`. Do not mix old regional laminate recommendations with current regional ones automatically.
- **S6a — HP Opaque Scrim support technical table.** https://support.hplfmedia.com/docs/hp-opaque-scrim — `turn129174297search4`.
- **S6b — HP Opaque Scrim Q1902C product page.** https://hp.globalbmg.com/en/hp-opaque-scrim-60x50-2 — `turn129174297search5`. **Conflict:** support page lists 480g/m²; product page contains 495GSM and 486GSM entries. Preserve this conflict and require verified SKU-specific current documentation before committing a GSM; source shows a datasheet last updated 2025-12-19 but that alone does not resolve inconsistent page fields.
- **S7 — Mondi Color Copy formats and GSM options.** https://www.mymondi.net/en/ufp/brand/color-copy-original/ — `turn201445154search1`, opened as `turn214553201view4`.
- **S8 — Mohawk paper weight vs caliper / US basis-weight explanation.** https://www.mohawkconnects.com/article/mohawk-blog/choosing-right-paper-right-job — `turn129174297search7`. Older explanatory article; dimensional distinction is stable, and actual stock data must still come from its current datasheet.
- **S9 — Epson GS3 capacities and ink-use variables/maintenance.** https://epson.com/For-Home/Ink/Epson-T51U-Ink-Packs/i/T51U — `turn129174297search6`. Official indexed retrieval returned the details; direct open later returned HTTP 503 (`turn214553201view5`). Reopen before final citation if access recovers.
- **S10 — SloanLED SE product-specific module, pack, PSU and density data.** https://sloanled.com/downloads/SpecSheet-SloanLEDSE-Global.pdf — `turn201445154search4` (Rev C, 2019-06-06). Installation guide: https://sloanled.com/downloads/InstallGuide-SloanLEDSE.pdf — `turn201445154search6`.
- **S11 — SloanLED per-product PSU capacity and 90% load chart.** https://sloanled.com/downloads/PowerSupplyCapacityChart-Global.pdf — `turn201445154search5`. It includes split outputs such as 120D1 and per-product module counts; do not generalize one row to a different product.
- **S12 — Mean Well LPV-60 official supply specifications.** https://www.meanwell.com/Upload/PDF/LPV-60/LPV-60-SPEC.PDF — `turn201445154search7`. General installation/derating context from prior research: https://www.meanwell.com/Upload/PDF/LED_EN.pdf (root already retrieved in previous phase; not re-retrieved in this note).
- **S13 — Unisub 5995 gift blank product.** https://www.unisub.com/product/aluminum-rectangle-key-chain-5995/ — `turn641813912search3`, opened as `turn214553201view6`.
- **S14 — Unisub substrates and manufacturer catalog.** https://www.unisub.com/products/ — `turn641813912search1`; official substrate/catalog PDF: https://www.unisub.com/wp-content/uploads/2025/04/Unisub-Digital-Catalog-USA-EMEA-2024-PRINT-version-compressed.pdf — `turn641813912search8`; document library/SDS request routes: https://www.unisub.com/resources/documents/ — `turn641813912search0`.

## Recommended next decisions (no implementation performed)

1. Approve the separation of services, material SKUs, packaging conversions, branch lots, physical assets and append-only movements.
2. Start with operator-confirmed supplier templates; no automatic live inventory or cost population. Import sources with region/revision/conflict fields.
3. Add physical roll and remnant identity before promising robust stock availability; scalar m² cannot represent cutability or continuity.
4. Extend LED calculations to per-output constraints and manufacturer product relationships before calling PSU planning comprehensive.
5. Put all reservation, receipt, issue and tenant authorization rules in server transactions; the Windows/customer/employee clients and provisioning portal use the same enforced domain rules.
