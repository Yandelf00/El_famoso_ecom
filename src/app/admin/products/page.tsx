import React from 'react'
import PageHeader from '../_components/PageHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table'
import db from '@/db/db'
import { CheckCircle2 } from 'lucide-react'
import { XCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { formatNumber } from '@/lib/formatters'
import { MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ActiveToggleDropdownItem, DeleteDropdownItem} from './_components/ProductActions'


export default function AdminProductsPage() {
  return (
  <>
    <div className='flex justify-between items-center gap-4'>
        <PageHeader>Products</PageHeader>
        <Button asChild>
            <Link href="/admin/products/new">Add Product</Link>
        </Button>
        <ProductsTable />
    </div>
  </>
  )
}

async function ProductsTable(){
    const products = await db.product.findMany({
        select : {
            id : true,
            name : true,
            priceInCents : true,
            isAvailableForPurchase : true,
            _count : { select : {orders:true}},
        },
        orderBy:{name:"asc"},
    })
    if (products.length === 0) return <p>No products found</p>
    return(
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='w-0'>
                        <span className='sr-only'>Available for Purchase</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className='w-0'>
                        <span className='sr-only'>Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map(product=>(
                    <TableRow key={product.id}>
                        <TableCell>
                            {product.isAvailableForPurchase ? (
                            <>
                                <span className='sr-only'>Available</span>
                                <CheckCircle2/>
                            </>
                            ): (
                            <>
                                <span className='sr-only'>Unavailable</span>
                                <XCircle/>
                            </>
                            )}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
                        <TableCell>{formatNumber(product._count.orders)}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreVertical/>
                                    <span className='sr-only'>Actions</span>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <a download href={`/admin/products/${product.id}/download`}>
                                    Download
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                    Edit
                                    </Link>
                                </DropdownMenuItem>
                                <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />
                                <DeleteDropdownItem id={product.id} disabled={product._count.orders>0} />
                            </DropdownMenuContent>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table>
    )
}
