"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

// type LoadState = "idle" | "loading" | "error" | "ready";
type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
    const [products, setProducts] = useState<Product[]>([]);
    // const [status, setStatus] = useState<LoadState>("idle");
    const [status, setStatus] = useState<LoadState>("loading");
    const [errorMessage, setErrorMessage] = useState("");

    // State สำหรับจัดการ การแก้ไข และ การดูรีวิว
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts(defaultQuery).then(showResult).catch(showError);
        // เติม: สิ่งที่กำหนดให้ทำงานเพียงครั้งเดียวตอนแสดงผลครั้งแรก
    }, []);

    function showResult(list: ProductList) {
        setProducts(list.products);
        setStatus("ready");
        console.log(products);
    }

    function showError(error: unknown) {
        setErrorMessage(
            error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
        );
        setStatus("error");
    }

    async function loadProducts(query: SearchQuery) {
        setStatus("loading");
        setErrorMessage("");

        try {
            showResult(await fetchProducts(query));
        } catch (error) {
            showError(error);
        }
    }

    function saveProduct(draft: ProductDraft) {
        if (editingProduct) {
            // กรณีแก้ไข: อัปเดตรายการเดิมที่มี id ตรงกัน
            setProducts(
                products.map((item) =>
                    item.id === editingProduct.id ? { ...item, ...draft } : item
                )
            );
            setEditingProduct(null);
        } else {
            // กรณีเพิ่มใหม่: คัดลอกสมาชิกเดิมทั้งหมดของ Array
            setProducts([...products, { ...draft, id: Date.now() }]);
        }
    }

    // ฟังก์ชั่นสำหรับลบสินค้า
    function deleteProduct(id: number) {
        if (confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) {
            setProducts(products.filter((item) => item.id !== id));
            if (selectedProduct?.id === id) setSelectedProduct(null);
        }
    }

    return (
        <main className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">รายการสินค้า</h1>
                    <p className="text-sm text-slate-500 mt-1">จัดการ ค้นหา และดูรีวิวสินค้าทั้งหมด</p>
                </div>

                <button
                    type="button"
                    onClick={() => loadProducts(defaultQuery)}
                    disabled={status === "loading"}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                    {status === "loading" ? "กำลังโหลด..." : "โหลดข้อมูลใหม่"}
                </button>
            </div>

            {/* ค้นหา */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <ProductSearchForm onSearch={loadProducts} />
            </div>

            {/* ส่วนแสดงผลแบบการ์ด */}
            <section aria-live="polite">
                {/* {status === "idle" && <p>คลิกปุ่มโหลดข้อมูลเพื่อเริ่ม</p>} */}

                {status === "loading" && (
                    <div className="bg-white p-12 text-center text-slate-500 rounded-2xl border border-slate-200">
                        กำลังโหลดข้อมูลสินค้า...
                    </div>
                )}

                {status === "error" && (
                    <div role="alert" className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-sm">
                        {errorMessage}
                    </div>
                )}

                {status === "ready" && products.length === 0 && (
                    <div className="bg-white p-12 text-center text-slate-500 rounded-2xl border border-slate-200">
                        ไม่พบสินค้าที่ตรงกับเงื่อนไข
                    </div>
                )}

                {/* Product Cards Grid */}
                {status === "ready" && products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {products.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                            >
                                <div>
                                    {/* Image Container */}
                                    <div className="w-full h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <span className="text-xs font-semibold text-slate-400">ไม่มีรูปภาพ</span>
                                        )}
                                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-md text-xs font-medium text-slate-700 rounded-full border border-slate-200/80 shadow-xs">
                                            {item.category}
                                        </span>
                                    </div>

                                    {/* Body Content */}
                                    <div className="p-4 space-y-2">
                                        <h3 className="font-bold text-slate-800 text-base line-clamp-1">{item.title}</h3>

                                        <div className="flex items-center justify-between pt-1">
                                            <div>
                                                <p className="text-xs text-slate-400">ราคา</p>
                                                <p className="text-lg font-bold text-blue-600">${item.price}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400">คงเหลือ</p>
                                                <p className={`text-sm font-semibold ${item.stock < 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                                                    {item.stock} ชิ้น
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Action Buttons */}
                                <div className="p-4 pt-0 grid grid-cols-3 gap-2 border-t border-slate-100 mt-2 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProduct(item)}
                                        className="px-2 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer"
                                    >
                                        ⭐ รีวิว
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingProduct(item)}
                                        className="px-2 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-all cursor-pointer"
                                    >
                                        ✏️ แก้ไข
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => deleteProduct(item.id)}
                                        className="px-2 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                                    >
                                        🗑️ ลบ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Form Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <ProductForm
                    editing={editingProduct}
                    onSave={saveProduct}
                    onCancel={() => setEditingProduct(null)}
                />
            </div>

            {/* Modal ป๊อบอัปแสดงรายละเอียด & รีวิว */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-lg font-bold text-slate-800">รายละเอียดสินค้า & รีวิว</h2>
                            <button
                                type="button"
                                onClick={() => setSelectedProduct(null)}
                                className="text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer"
                            >
                                ✕ ปิด
                            </button>
                        </div>

                        {selectedProduct.thumbnail && (
                            <img
                                src={selectedProduct.thumbnail}
                                alt={selectedProduct.title}
                                className="w-full h-48 object-cover rounded-xl bg-slate-100"
                            />
                        )}

                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-900">{selectedProduct.title}</h3>
                            <p className="text-sm text-slate-500">หมวดหมู่: {selectedProduct.category}</p>
                        </div>

                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl text-sm">
                            <div>
                                <span className="text-slate-500">ราคา: </span>
                                <span className="font-bold text-blue-600">${selectedProduct.price}</span>
                            </div>
                            <div>
                                <span className="text-slate-500">คงเหลือ: </span>
                                <span className="font-semibold text-slate-800">{selectedProduct.stock} ชิ้น</span>
                            </div>
                        </div>

                        {/* ส่วนรีวิว */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                💬 รีวิวจากผู้ซื้อ {selectedProduct.rating && `(${selectedProduct.rating} ⭐)`}
                            </h4>

                            {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {selectedProduct.reviews.map((rev: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                                            <div className="flex justify-between font-semibold text-slate-700">
                                                <span>{rev.reviewerName || "ผู้ใช้งานทั่วไป"}</span>
                                                <span className="text-amber-500">{rev.rating} ⭐</span>
                                            </div>
                                            <p className="text-slate-600">{rev.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic">ยังไม่มีรีวิวสำหรับสินค้านี้</p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedProduct(null)}
                            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all cursor-pointer"
                        >
                            ปิดหน้าต่าง
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}