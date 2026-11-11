import { CartItem, Order, StoreSettings } from '../types';

export function formatPrice(amount: number, symbol: string = 'S/'): string {
  return `${symbol} ${amount.toFixed(2)}`;
}

export function generateOrderNumber(): string {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `PCH-${randomPart}`;
}

export function buildWhatsAppMessage(order: Order, settings: StoreSettings): string {
  const lineSeparator = '--------------------------------';
  const itemsText = order.items
    .map((item, idx) => {
      const sizeText = item.selectedSize ? ` (${item.selectedSize.name})` : '';
      const mixText = item.customMix && item.customMix.length > 0 ? `\n   Mix: ${item.customMix.join(' + ')}` : '';
      const labelText = item.customLabel ? `\n   Dedicatoria: "${item.customLabel}"` : '';
      const notesText = item.notes ? `\n   Nota: ${item.notes}` : '';
      const itemSubtotal = formatPrice(item.unitPrice * item.quantity, settings.currencySymbol);
      return `${idx + 1}. *${item.product.name}* x${item.quantity}${sizeText} — ${itemSubtotal}${mixText}${labelText}${notesText}`;
    })
    .join('\n\n');

  const paymentNames: Record<string, string> = {
    yape_plin: '📱 Yape / Plin',
    cash: '💵 Efectivo contra entrega',
    transfer: '🏦 Transferencia bancaria',
    card: '💳 Tarjeta contra entrega / link',
  };

  const paymentDetail = paymentNames[order.paymentMethod] || order.paymentMethod;
  const changeDetail = order.paymentChangeAmount ? ` (Paga con: S/ ${order.paymentChangeAmount})` : '';

  const discountText = order.discount > 0 
    ? `\n🎁 Descuento cupón: -${formatPrice(order.discount, settings.currencySymbol)}` 
    : '';

  const notesSection = order.notes ? `\n\n📝 *Indicaciones:* ${order.notes}` : '';
  const referenceSection = order.deliveryReference ? `\n📍 *Referencia:* ${order.deliveryReference}` : '';

  const message = `🍿 *¡HOLA POCHITO! Deseo realizar un pedido* 🍿
*Código de Pedido:* #${order.orderNumber}
${lineSeparator}

👤 *Cliente:* ${order.customerName}
📞 *Teléfono:* ${order.customerPhone}
📍 *Dirección:* ${order.deliveryAddress} (${order.deliveryZone})${referenceSection}
💳 *Método de Pago:* ${paymentDetail}${changeDetail}

${lineSeparator}
🛒 *DETALLE DEL PEDIDO:*
${itemsText}
${lineSeparator}

💰 *Subtotal:* ${formatPrice(order.subtotal, settings.currencySymbol)}
🛵 *Envío:* ${order.deliveryFee === 0 ? '¡GRATIS!' : formatPrice(order.deliveryFee, settings.currencySymbol)}${discountText}
✨ *TOTAL A PAGAR:* ${formatPrice(order.total, settings.currencySymbol)}${notesSection}

⏱️ *Tiempo estimado:* ${settings.deliveryTimeEstimate}
¡Quedo atento a la confirmación! Muchas gracias 💛`;

  return encodeURIComponent(message);
}
