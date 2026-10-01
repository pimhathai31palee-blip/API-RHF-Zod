"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
    onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm(
    { onSearch }: ProductSearchFormProps
) {
    //V.1
    //const { register } = useForm<SearchQuery>({
    //    defaultValues: defaultQuery,
    //});

    //V.2
    //const {
    //register,
    //formState: { errors },
    //} = useForm<SearchQuery>({
    // เติม: ตัวเชื่อมที่ทำให้ React Hook Form ตรวจข้อมูลด้วย Zod Schema
    //resolver: zodResolver(SearchQuerySchema),
    //mode: "onTouched",
    //defaultValues: defaultQuery,
    //});

    //V.3
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SearchQuery>({
        resolver: zodResolver(SearchQuerySchema),
        mode: "onTouched",
        defaultValues: defaultQuery,
    });


    return (
        <form 
            onSubmit={handleSubmit(onSearch)} 
            noValidate
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
            <div className="flex flex-col gap-1.5">
                <label htmlFor="q" className="text-xs font-semibold text-slate-600">คำค้น</label>
                <input 
                    id="q" 
                    {...register("q")} 
                    placeholder="phone" 
                    className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50/50"
                />
            </div>

            {/*<label htmlFor="limit">จำนวนรายการ</label>
            <input id="limit" type="number" required
                // เติม: ชื่อฟิลด์ที่ต้องการผูกเข้ากับฟอร์ม
                {...register("limit", { valueAsNumber: true })} /> */}
            
            <div className="flex flex-col gap-1.5 relative">
                <label htmlFor="limit" className="text-xs font-semibold text-slate-600">จำนวนรายการ</label>
                <input
                    id="limit"
                    type="number"
                    required
                    {...register("limit", { valueAsNumber: true })}
                    aria-invalid={!!errors.limit}
                    aria-describedby="limit-error"
                    className={`px-3.5 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-slate-50/50 ${
                        errors.limit 
                            ? "border-red-400 focus:ring-red-400 text-red-900" 
                            : "border-slate-200 focus:ring-slate-400"
                    }`}
                />
                {errors.limit && (
                    <span 
                        id="limit-error" 
                        role="alert" 
                        className="text-xs text-red-500 absolute -bottom-5 left-0"
                    >
                        {errors.limit?.message}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="sortBy" className="text-xs font-semibold text-slate-600">เรียงตาม</label>
                <select 
                    id="sortBy" 
                    {...register("sortBy")}
                    className="px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50/50 cursor-pointer"
                >
                    {SORT_FIELDS.map((field) => (
                        <option key={field} value={field}>{field}</option>
                    ))}
                </select>
            </div>

            <div>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                    {isSubmitting ? "กำลังค้นหา" : "ค้นหา"}
                </button>
            </div>

        </form>
    );
}