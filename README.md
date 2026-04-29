# Polifood Frontend

Frontend en React + TypeScript + Tailwind para la app Polifood.

## Ejecutar

```bash
npm install
npm run dev
```

## Mocks vs Backend real

Por defecto usa mocks/localStorage.

Para conectar con backend real, crea un archivo `.env`:

```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:5000/api
```

## Endpoints esperados

- `POST /api/Auth/login`
- `POST /api/Auth/register`
- `GET /api/Product`
- `GET /api/Cart`
- `POST /api/Cart/{id}/add-item`
- `PATCH /api/Cart/{id}/update-quantity`
- `DELETE /api/Cart/{id}/remove-item/{productId}`
- `POST /api/Cart/{id}/checkout`
- `GET /api/Order`
- `POST /api/Order/{id}/confirm-payment`
- `PATCH /api/Order/{id}/change-status`

## Nota importante

En tu `CartController`, cambia esta ruta:

```csharp
[HttpDelete("{id}/remove-item/{product_id}")]
public async Task<IActionResult> RemoveItem(Guid id, Guid productId)
```

por esta:

```csharp
[HttpDelete("{id}/remove-item/{productId}")]
public async Task<IActionResult> RemoveItem(Guid id, Guid productId)
```

para que coincida el nombre del parámetro de la ruta con el parámetro del método.
