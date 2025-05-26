import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
    addProducts,
    addToCart,
    CartItem,
    incrementPage,
    Product,
    removeFromCart,
    setHasMoreProducts,
    setLoading,
    setProducts,
    setSelectedCategory,
    updateCartQuantity
} from "../store/slices/products";
import useFetch from "./useFetch";

export const useProducts = () => {
    const dispatch = useDispatch();
    const { cart, selectedCategory, products, loading, currentPage, hasMoreProducts } = useSelector((state: RootState) => state.products);
    const { fetchData } = useFetch();

    // Load products using fetchData
    const loadProducts = async (pageNum = 1, category = selectedCategory) => {
        if (pageNum === 1) {
            dispatch(setProducts([]));
        }

        dispatch(setLoading(true));

        try {
            // Use fetchData with TheMealDB endpoint
            const response = await fetchData({
                endPoint: `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
                method: 'GET'
            });

            if (response?.meals) {
                const mealsWithPrices = response.meals.map((meal: any) => ({
                    ...meal,
                    price: Math.floor(Math.random() * 50) + 10
                }));

                // Simulate pagination
                const itemsPerPage = 6;
                const startIndex = (pageNum - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedMeals = mealsWithPrices.slice(startIndex, endIndex);

                if (pageNum === 1) {
                    dispatch(setProducts(paginatedMeals));
                } else {
                    dispatch(addProducts(paginatedMeals));
                }

                dispatch(setHasMoreProducts(endIndex < mealsWithPrices.length));
            }
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Load more products for pagination
    const loadMore = () => {
        if (!loading && hasMoreProducts) {
            const nextPage = currentPage + 1;
            dispatch(incrementPage());
            loadProducts(nextPage);
        }
    };

    // Change category
    const changeCategory = (category: string) => {
        dispatch(setSelectedCategory(category));
        loadProducts(1, category);
    };

    // Cart functions
    const addProductToCart = (product: Product) => dispatch(addToCart(product));
    const removeProductFromCart = (productId: string) => dispatch(removeFromCart(productId));
    const updateProductQuantity = (productId: string, quantity: number) =>  dispatch(updateCartQuantity({ id: productId, quantity }));
    const getCartTotal = () => cart.reduce((total: number, item: CartItem) => total + (item.product.price || 0) * item.quantity, 0);
    const getCartItemsCount = () => cart.reduce((total: number, item: CartItem) => total + item.quantity, 0)
    const isInCart = (productId: string) => cart.some((item: CartItem) => item.product.idMeal === productId);
    const getCartItem = (productId: string): CartItem | undefined => cart.find((item: CartItem) => item.product.idMeal === productId);

    useEffect(() => {
        loadProducts(1, selectedCategory);
    }, [selectedCategory]);

    return {
        // Products data
        products,
        loading,
        hasMore: hasMoreProducts,
        categories: [], // We'll keep this simple for now
        selectedCategory,
        // Cart data
        cart,
        cartTotal: getCartTotal(),
        cartItemsCount: getCartItemsCount(),
        // Functions
        loadMore,
        changeCategory,
        addProductToCart,
        removeProductFromCart,
        updateProductQuantity,
        isInCart,
        getCartItem,
    };
};