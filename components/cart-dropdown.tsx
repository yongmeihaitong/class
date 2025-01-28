"use client"

import { ShoppingCart, X } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"

export function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, totalItems, totalPrice } = useCart()

  return (
    <div className="relative">
      <Button size="icon" variant="ghost" className="relative" onClick={() => setIsOpen(!isOpen)}>
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background border rounded-md shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Your Cart</h3>
            {items.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty</p>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span className="text-sm">{item.title}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold mr-2">${item.price}</span>
                      <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">${totalPrice}</span>
                  </div>
                  <Button className="w-full">Checkout</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

