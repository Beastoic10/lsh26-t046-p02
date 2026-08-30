import { NextResponse } from 'next/server';

function processInventory(today: string, items: any[], mark_returned: string[]) {
    const returnedSet = new Set(mark_returned || []);

    const processedItems = items.map((item) => {
        const isReturned = returnedSet.has(item.id);
        const isExpired = item.expiry <= today;

        return {
            ...item,
            status: isReturned ? 'returned' : isExpired ? 'expired' : 'active',
        };
    });

    return {
        summary: {
            total: items.length,
            returned_count: mark_returned.length,
        },
        items: processedItems,
    };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // If it's an array of cases (from cases.json)
        if (body.cases) {
            const results = body.cases.map((c: any) => ({
                case_id: c.case_id,
                result: processInventory(c.today, c.items, c.mark_returned)
            }));
            return NextResponse.json(results);
        }
        
        // Single case
        const { today, items, mark_returned } = body;
        const result = processInventory(today, items, mark_returned);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
}