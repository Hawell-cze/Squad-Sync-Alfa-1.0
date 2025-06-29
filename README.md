# 🛸 SquadSync – Live týmová koordinace

**Verze:** Alfa 1.0
**Stav:** Vývojová fáze  
**Autor:** Tomáš  
**Vytvořeno v rámci závěrečného projektu kurzu programování na VŠB**

---

## 🧭 O projektu

SquadSync je webová aplikace zaměřená na **živé řízení a koordinaci týmů** v reálném čase.  
Umožňuje vytvářet sessiony (týmové místnosti), připojovat a schvalovat členy, sledovat jejich stav a spravovat aktivní úkoly nebo průběh týmové akce.

---

## 🧱 Architektura

Aplikace je rozdělena do dvou hlavních částí:

### 🔙 Backend – Java Spring Boot REST API

RESTové rozhraní zajišťující kompletní správu uživatelů a sessionů.

#### Funkce:
- ✅ Registrace a přihlášení uživatelů  
- ✅ Vytváření a správa sessionů  
- ✅ Připojení uživatele na session (včetně schvalovacího procesu)  
- ✅ Změna stavů uživatelů (`PENDING`, `JOINED`, `KICKED`, `CANCELED`)  
- ✅ Načítání členů a přehled aktivních sessionů  
- ✅ Validace dat pomocí DTO (`Request` / `Response` objekty)

---

### 🎨 Frontend – Angular

Moderní SPA s důrazem na přehlednost, živou vizualizaci a responzivitu.

#### Funkce:
- 🎛️ Vizuální dashboard pro commandera (velitele session)  
- 👥 Seznam čekajících členů s možností schvalování  
- 🔄 Automatický polling a reaktivní vykreslování členů  
- 🧭 Navigace do jednotlivých session podle tokenu  
- 🔐 Validace vstupních údajů na straně klienta

---

## 💡 Princip fungování

1. **Komandér** vytvoří session
2. **Uživatelé** se mohou připojit – získávají nejprve stav `PENDING`
3. **Komandér** schvaluje nebo odmítá jednotlivé členy
4. Po přijetí má uživatel stav `JOINED` a zobrazí se v dashboardu

---

## 🚧 Poznámky k vývoji

- Projekt se nachází ve **verzi Alfa 1.0** – probíhá aktivní vývoj
- API je funkční, ale může se měnit
- Chybové stavy, bezpečnost a notifikace se budou v dalších verzích rozšiřovat

---

## 🧭 Plánovaný vývoj

### 🟢 Blízký vývoj (verze 1.x)

- 🧑‍✈️ Rozdávání příkazů jednotlivým členům session
- 📱 Speciální dashboard pro běžné členy (rolový přístup)
- 🪖 Možnost spojit více sessionů do struktur jako *Velitel – Četa*


### 🟡 Delší vývoj (verze 2.x a dál)

- 🗺️ Výběr typu session – například geolokační s mapou (např. airsoftové akce, hudební festivaly apod.)
- 🌌 Napojení na hru Star Citizen + nativní desktopová aplikace (Windows)
- 💬 Integrovaný chat mezi členy a komandérem
- 🧾 Detailní vizualizace karet členů v commander view (např. stav, vybavení, role)




