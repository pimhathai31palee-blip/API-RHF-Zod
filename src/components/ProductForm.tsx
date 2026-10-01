"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
    editing: Product | null;
    onSave: (draft: ProductDraft) => void;
    onCancel: () => void;
};


export default function ProductForm(
    { editing, onSave, onCancel }: ProductFormProps
) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isValid },
    } = useForm<ProductDraft>({
        resolver: zodResolver(ProductDraftSchema),
        mode: "onTouched",
        defaultValues: editing
            ? {
                title: editing.title, price: editing.price,
                stock: editing.stock, category: editing.category
            }
            : { title: "", price: undefined, stock: undefined },
    });

    function saveProduct(values: ProductDraft) {
        onSave(values);
        reset();
    }


    return (
        <form
            onSubmit={handleSubmit(saveProduct)}
            noValidate
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end bg-white p-6 rounded-2xl border border-slate-200 shadow-xs"
        >
            {/* ชื่อสินค้า */}
            <div className="flex flex-col gap-1.5 relative">
                <label htmlFor="title" className="text-xs font-semibold text-slate-600">ชื่อสินค้า</label>
                <input
                    id="title"
                    required
                    {...register("title")}
                    aria-invalid={!!errors.title}
                    aria-describedby="title-error"
                    className={`w-full px-3.5 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-slate-50/50 ${errors.title
                            ? "border-red-400 focus:ring-red-400 text-red-900"
                            : "border-slate-200 focus:ring-slate-400"
                        }`}
                />
                <span id="title-error" role="alert" className="text-xs text-red-500 absolute -bottom-5 left-0">
                    {errors.title?.message}
                </span>
            </div>

            {/* ราคา */}
            <div className="flex flex-col gap-1.5 relative">
                <label htmlFor="price" className="text-xs font-semibold text-slate-600">ราคา</label>
                <input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    // เติม: ตัวเลือกที่สั่งให้แปลงค่าเป็นตัวเลขก่อนส่งให้ Schema
                    {...register("price", { valueAsNumber: true })}
                    aria-invalid={!!errors.price}
                    aria-describedby="price-error"
                    className={`w-full px-3.5 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-slate-50/50 ${errors.price
                            ? "border-red-400 focus:ring-red-400 text-red-900"
                            : "border-slate-200 focus:ring-slate-400"
                        }`}
                />
                <span id="price-error" role="alert" className="text-xs text-red-500 absolute -bottom-5 left-0">
                    {errors.price?.message}
                </span>
            </div>

            {/* <label htmlFor="category"> จำนวนคงเหลือ</label>
            <input
                id="price"
                type="number"
                step="0.01"
                required
                // เติม: ตัวเลือกที่สั่งให้แปลงค่าเป็นตัวเลขก่อนส่งให้ Schema
                {...register("price", { valueAsNumber: true })}
                aria-invalid={!!errors.price}
                aria-describedby="price-error"
            /> */}

            {/* หมวดหมู่ */}
            <div className="flex flex-col gap-1.5 relative">
                <label htmlFor="category" className="text-xs font-semibold text-slate-600">หมวดหมู่</label>
                <select
                    id="category"
                    required
                    {...register("category")}
                    aria-invalid={!!errors.category}
                    aria-describedby="category-error"
                    className={`w-full px-3.5 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-slate-50/50 cursor-pointer ${errors.category
                            ? "border-red-400 focus:ring-red-400 text-red-900"
                            : "border-slate-200 focus:ring-slate-400"
                        }`}
                >
                    <option value="">กรุณาเลือกหมวดหมู่</option>
                    {CATEGORIES.map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
                <span id="category-error" role="alert" className="text-xs text-red-500 absolute -bottom-5 left-0">
                    {errors.category?.message}
                </span>
            </div>

            {/* ปุ่มดำเนินการ */}
            <div className="flex gap-2 w-full">
                <button
                    type="submit"
                    // เติม: ค่าที่บอกว่าข้อมูลทั้งฟอร์มผ่าน Schema แล้วหรือไม่
                    disabled={!isDirty || !isValid}
                    className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                </button>

                {editing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-xl transition-all cursor-pointer"
                    >
                        ยกเลิก
                    </button>
                )}
            </div>

        </form>
    );
}