import { createServerSupabaseClient } from '@/lib/supabase/server'
import EnquiryRow from './EnquiryRow'

export default async function AdminEnquiries() {
  const supabase = createServerSupabaseClient()
  const { data: enquiries } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-text">Enquiries</h1>
        <p className="text-sm text-mid mt-1">{enquiries?.length || 0} total enquiries</p>
      </div>

      <div className="bg-bg2 border border-border rounded-xl overflow-hidden">
        {/* Desktop view */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-[0.65rem] tracking-[0.2em] uppercase text-mid font-normal">Name</th>
                <th className="text-left p-4 text-[0.65rem] tracking-[0.2em] uppercase text-mid font-normal">Email</th>
                <th className="text-left p-4 text-[0.65rem] tracking-[0.2em] uppercase text-mid font-normal">Type</th>
                <th className="text-left p-4 text-[0.65rem] tracking-[0.2em] uppercase text-mid font-normal">Date</th>
                <th className="text-center p-4 text-[0.65rem] tracking-[0.2em] uppercase text-mid font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries && enquiries.length > 0 ? (
                enquiries.map((eq) => (
                  <EnquiryRow key={eq.id} enquiry={eq} />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-mid/50 text-sm">
                    No enquiries yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="md:hidden divide-y divide-border">
          {enquiries && enquiries.length > 0 ? (
            enquiries.map((eq) => (
              <EnquiryRow key={eq.id} enquiry={eq} mobile />
            ))
          ) : (
            <div className="p-8 text-center text-mid/50 text-sm">No enquiries yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
