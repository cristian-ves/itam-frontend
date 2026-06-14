interface Props {
    columns: string[]
    rows: Record<string, any>[]
}

export const ReporteTable = ({ columns, rows }: Props) => {
    if (rows.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400 text-sm">
                No hay datos para mostrar.
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col}
                                className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {rows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                            {Object.values(row).map((val, j) => (
                                <td key={j} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                                    {val !== null && val !== undefined ? String(val) : "—"}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}