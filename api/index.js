import profile from '@/api/profile'
import permission from '@/api/permission'
import role from '@/api/role'
import user from '@/api/user'
import common from '@/api/common'
import dashboard from '@/api/dashboard'
import customer from '@/api/customer'
import customerType from '@/api/customer-type'
import supplier from '@/api/supplier'
import product from '@/api/product'
import unit from '@/api/unit'
import order from '@/api/order'
import quotation from '@/api/quotation'
import stock from '@/api/stock'
import debt from '@/api/debt'
import revenue from '@/api/revenue'
import payment from '@/api/payment'

export default ($axios) => ({
  profile: profile($axios),
  permission: permission($axios),
  role: role($axios),
  user: user($axios),
  common: common($axios),
  dashboard: dashboard($axios),
  customer: customer($axios),
  customerType: customerType($axios),
  supplier: supplier($axios),
  product: product($axios),
  unit: unit($axios),
  order: order($axios),
  quotation: quotation($axios),
  stock: stock($axios),
  debt: debt($axios),
  revenue: revenue($axios),
  payment: payment($axios)
})
