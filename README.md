# Site Notebook

A simple digital notebook for construction contractors to record materials bought, labour and other expenses, and payments received, site by site. It replaces writing everything in a paper book and shows totals automatically.

Built with plain HTML, CSS and JavaScript. It works on phones and computers and needs no installation.

## Features

- Three entry types: material bought, labour / other expense, payment received
- Every entry has a date, site, supplier / worker / client, details and amount in rupees
- Summary of money received, money spent, balance and amount still to pay
- Mark unpaid expenses as paid later
- Search, and filter by site or entry type; the summary updates for the filtered view
- Download a backup file and restore it later; export all entries to CSV for Excel
- Data is saved in the browser (localStorage)

## How to run

1. Download or clone this repository.
2. Open `index.html` in a browser.

## Use on a phone

1. Publish the repository with GitHub Pages (Settings, Pages, deploy from the main branch).
2. Open the page link in Chrome (Android) or Safari (iPhone).
3. Choose Add to Home screen (Android: menu, Install app). It then opens like a normal app and works offline.

## Where data is stored

Entries are stored on the device, in the browser's local storage. Nothing is sent to a server, so nobody else can see the data, but it is not shared between devices either. Use **Download backup** regularly and keep the file somewhere safe (WhatsApp to self, Google Drive).

## Important

Data is stored only in the browser it was entered in. Clearing browser data or switching phones will remove it, so use **Download backup** regularly.

## Project structure

```
site-notebook/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Future improvements

- Edit existing entries
- Malayalam and Hindi language options
- Per-site reports that can be printed or shared as PDF
- Online storage so data syncs across devices

## Author

**Muhammed Aahil Zishan AM**
[LinkedIn](https://www.linkedin.com/in/aahil-zishan-6b99a4312/) | [Portfolio](https://12aahil34.github.io/portfolio/) | [GitHub](https://github.com/12aahil34)
